import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import prisma from "../models/prisma.js";

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let projects;
    if (role === "Admin") {
      projects = await prisma.project.findMany({
        include: { members: { include: { user: true } }, creator: true, tasks: true },
      });
    } else {
      projects = await prisma.project.findMany({
        where: {
          members: { some: { userId: userId as string } },
        },
        include: { members: { include: { user: true } }, creator: true, tasks: true },
      });
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
    const members = memberEmails ? await prisma.user.findMany({
      where: { email: { in: memberEmails } }
    }) : [];

    const project = await prisma.project.create({
      data: {
        title,
        description,
        createdBy: userId,
        members: {
          create: members.map((m: any) => ({ userId: m.id }))
        }
      },
      include: { members: { include: { user: true } } }
    });

    res.status(201).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const { title, description, memberEmails } = req.body;

    const members = memberEmails ? await prisma.user.findMany({
      where: { email: { in: memberEmails } }
    }) : [];

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        members: {
          deleteMany: {},
          create: members.map((m: any) => ({ userId: m.id }))
        }
      },
      include: { members: { include: { user: true } } }
    });

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Delete tasks first or use cascade in schema (Prisma handles relations)
    await prisma.task.deleteMany({ where: { projectId: id as string } });
    await prisma.project.delete({ where: { id: id as string } });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
