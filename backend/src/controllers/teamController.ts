import { Request, Response } from "express";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({
        path: "tasksAssigned",
        populate: { path: "project", select: "title" },
      });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const updateRemarks = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "Admin") {
      return res.status(403).json({ message: "Only Admins can update remarks" });
    }
    const id = String(req.params.id);
    const { remarks } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { remarks },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Notification.create({
      userId: id,
      message: "An admin has updated your profile remarks.",
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating remarks" });
  }
};
