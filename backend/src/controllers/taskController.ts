import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import prisma from "../models/prisma.js";

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.query;
    const userId = req.user?.id;
    const role = req.user?.role;

    let where: any = {};
    if (projectId) where.projectId = projectId as string;
    
    if (role !== "Admin") {
      where.assignedTo = userId;
    }

    const tasks = await prisma.task.findMany({
      where,
      include: { assignee: true, project: true, creator: true },
      orderBy: { createdAt: "desc" },
    });

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

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo: assignedTo || null,
        projectId,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdBy: userId,
      },
      include: { assignee: true, project: true },
    });

    if (assignedTo && assignedTo !== userId) {
      await prisma.notification.create({
        data: {
          userId: assignedTo,
          message: `You have been assigned a new task: ${title}`,
        }
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

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: "Task not found" });

    // Members can only update status
    let updateData: any = { status };
    if (role === "Admin") {
      updateData = { title, description, assignedTo: assignedTo || null, priority, status, dueDate: dueDate ? new Date(dueDate) : null };
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: { assignee: true, project: true },
    });

    if (role === "Admin" && assignedTo && assignedTo !== existingTask.assignedTo && assignedTo !== userId) {
      await prisma.notification.create({
        data: {
          userId: assignedTo,
          message: `You have been assigned to task: ${task.title}`,
        }
      });
    }

    if (status === "Completed" && existingTask.status !== "Completed" && task.createdBy !== userId) {
      const completedBy = await prisma.user.findUnique({
        where: { id: userId || "" },
        select: { name: true },
      });

      await prisma.notification.create({
        data: {
          userId: task.createdBy,
          message: `Task completed: ${task.title} by ${completedBy?.name ?? "a team member"}`,
        }
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
    await prisma.task.delete({ where: { id } });
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
    if (role !== "Admin") {
      where.assignedTo = userId;
    }

    const [totalTasks, completedTasks, todoTasks, inProgressTasks, overdueTasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.count({ where: { ...where, status: "Completed" } }),
      prisma.task.count({ where: { ...where, status: "Todo" } }),
      prisma.task.count({ where: { ...where, status: "InProgress" } }),
      prisma.task.count({ 
        where: { 
          ...where, 
          status: { not: "Completed" },
          dueDate: { lt: new Date() }
        } 
      }),
    ]);

    const recentActivity = await prisma.task.findMany({
      where,
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { project: true }
    });

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
      recentActivity
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
