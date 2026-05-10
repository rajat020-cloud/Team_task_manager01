import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { getTasks, createTask, updateTask, deleteTask, getDashboardStats } from "../controllers/taskController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { taskSchema, updateTaskSchema } from "../validations/schemas.js";

const router = Router();
router.get("/", protect, getTasks);
router.get("/stats", protect, getDashboardStats);
router.post("/", protect, isAdmin, validate(taskSchema), createTask);
router.put("/:id", protect, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, isAdmin, deleteTask);

export default router;
