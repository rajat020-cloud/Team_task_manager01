import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => ({
            path: err.path,
            message: err.message,
          }));
        console.error("Validation failed:", JSON.stringify(errors));
        const combinedMessage = errors.map((e: any) => e.message).join(', ');
        return res.status(400).json({
          message: combinedMessage || "Validation failed",
          errors,
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
