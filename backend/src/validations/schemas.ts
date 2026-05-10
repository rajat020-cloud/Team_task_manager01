import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["Admin", "Member"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    memberEmails: z.array(z.string().email()).optional(),
  }),
});

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    assignedTo: z.string().optional().nullable(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z.enum(["Todo", "InProgress", "Completed"]).optional(),
    dueDate: z.string().optional().nullable(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    projectId: z.string().optional(),
    assignedTo: z.string().optional().nullable(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    status: z.enum(["Todo", "InProgress", "Completed"]).optional(),
    dueDate: z.string().optional().nullable(),
  }),
});
