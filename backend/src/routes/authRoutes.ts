import { Router } from "express";
import { signup, login } from "../controllers/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { signupSchema, loginSchema } from "../validations/schemas.js";

const router = Router();
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

export default router;
