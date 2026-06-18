import { StatusCodes } from "http-status-codes";
import { Request , Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error.js";
import { z } from "zod";

const createAirplaneSchema = z.object({
  modelNumber: z
    .string({
      message: "Model number must be a string",
    })
    .trim()
    .min(1, "Model number is required")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Model number must be alphanumeric (letters, numbers, spaces, and hyphens only)"),
  capacity: z
    .number({
      message: "Capacity must be a number",
    })
    .int("Capacity must be an integer")
    .gt(0, "Capacity must be greater than 0")
    .lte(1000, "Capacity must be less than or equal to 1000"),
});

export function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
  const result = createAirplaneSchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while creating airplane",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}