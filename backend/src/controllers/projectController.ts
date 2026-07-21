import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let projects;
    if (role === "Admin") {
      projects = await Project.find()
        .populate("members.user")
        .populate("creator")
        .populate("tasks");
    } else {
      projects = await Project.find({ "members.user": userId })
        .populate("members.user")
        .populate("creator")
        .populate("tasks");
    }

    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, memberEmails } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Connect existing members by email
    const members = memberEmails && memberEmails.length > 0
      ? await User.find({ email: { $in: memberEmails } })
      : [];

    let newProject = await Project.create({
      title,
      description,
      createdBy: userId,
      members: members.map((m: any) => ({ user: m._id })),
    });

    const project = await Project.findById(newProject._id)
      .populate("members.user")
      .populate("creator");

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const { title, description, memberEmails } = req.body;

    const members = memberEmails && memberEmails.length > 0
      ? await User.find({ email: { $in: memberEmails } })
      : [];

    const project = await Project.findByIdAndUpdate(
      id,
      {
        title,
        description,
        members: members.map((m: any) => ({ user: m._id })),
      },
      { new: true }
    )
      .populate("members.user")
      .populate("creator");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await Task.deleteMany({ projectId: id });
    await Project.findByIdAndDelete(id);

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
