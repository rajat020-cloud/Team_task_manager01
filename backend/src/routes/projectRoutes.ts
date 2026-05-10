import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { getProjects, createProject, updateProject, deleteProject } from "../controllers/projectController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { projectSchema } from "../validations/schemas.js";

const router = Router();
router.get("/", protect, getProjects);
router.post("/", protect, isAdmin, validate(projectSchema), createProject);
router.put("/:id", protect, isAdmin, validate(projectSchema), updateProject);
router.delete("/:id", protect, isAdmin, deleteProject);

export default router;
