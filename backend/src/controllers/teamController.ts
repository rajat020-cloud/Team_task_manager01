import { Request, Response } from 'express';
import prisma from '../models/prisma.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        remarks: true,
        tasksAssigned: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            project: { select: { title: true } }
          }
        }
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateRemarks = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'Admin') {
      return res.status(403).json({ message: 'Only Admins can update remarks' });
    }
    const id = String(req.params.id);
    const { remarks } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { remarks },
    });

    await prisma.notification.create({
      data: {
        userId: id,
        message: 'An admin has updated your profile remarks.',
      }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating remarks' });
  }
};
