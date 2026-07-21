import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.query;
    const userId = req.user?.id;
    const role = req.user?.role;

    let where: any = {};
    if (projectId) where.projectId = projectId;

    if (role !== "Admin" && userId) {
      const userProjects = await Project.find({ "members.user": userId }).select("_id");
      const projectIds = userProjects.map((p) => p._id);
      where.$or = [
        { assignedTo: userId },
        { projectId: { $in: projectIds } },
      ];
    }

    const tasks = await Task.find(where)
      .populate("assignee")
      .populate("project")
      .populate("creator")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedTo, projectId, priority, status, dueDate } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const newTask = await Task.create({
      title,
      description,
      assignedTo: assignedTo || null,
      projectId,
      priority,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdBy: userId,
    });

    const task = await Task.findById(newTask._id)
      .populate("assignee")
      .populate("project");

    if (assignedTo && assignedTo !== userId) {
      await Notification.create({
        userId: assignedTo,
        message: `You have been assigned a new task: ${title}`,
      });
    }

    res.status(201).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const { title, description, assignedTo, priority, status, dueDate } = req.body;
    const userId = req.user?.id;
    const role = req.user?.role;

    const existingTask = await Task.findById(id);
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    // Members can only update status
    let updateData: any = { status };
    if (role === "Admin") {
      updateData = {
        title,
        description,
        assignedTo: assignedTo || null,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      };
    }

    const task = await Task.findByIdAndUpdate(id, updateData, { new: true })
      .populate("assignee")
      .populate("project");

    if (!task) return res.status(404).json({ message: "Task update failed" });

    if (role === "Admin" && assignedTo && String(assignedTo) !== String(existingTask.assignedTo) && String(assignedTo) !== String(userId)) {
      await Notification.create({
        userId: assignedTo,
        message: `You have been assigned to task: ${task.title}`,
      });
    }

    if (status === "Completed" && existingTask.status !== "Completed" && String(task.createdBy) !== String(userId)) {
      const completedBy = await User.findById(userId || "").select("name");

      await Notification.create({
        userId: task.createdBy,
        message: `Task completed: ${task.title} by ${completedBy?.name ?? "a team member"}`,
      });
    }

    res.status(200).json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params["id"] as string;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    let where: any = {};
    if (role !== "Admin" && userId) {
      const userProjects = await Project.find({ "members.user": userId }).select("_id");
      const projectIds = userProjects.map((p) => p._id);
      where.$or = [
        { assignedTo: userId },
        { projectId: { $in: projectIds } },
      ];
    }

    const [totalTasks, completedTasks, todoTasks, inProgressTasks, overdueTasks] = await Promise.all([
      Task.countDocuments(where),
      Task.countDocuments({ ...where, status: "Completed" }),
      Task.countDocuments({ ...where, status: "Todo" }),
      Task.countDocuments({ ...where, status: "InProgress" }),
      Task.countDocuments({
        ...where,
        status: { $ne: "Completed" },
        dueDate: { $lt: new Date() },
      }),
    ]);

    const recentActivity = await Task.find(where)
      .limit(5)
      .sort({ updatedAt: -1 })
      .populate("project");

    res.status(200).json({
      totalTasks,
      completedTasks,
      pendingTasks: todoTasks + inProgressTasks,
      overdueTasks,
      tasksByStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
      },
      recentActivity,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
