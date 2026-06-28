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

const getAirplaneSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Airplane ID must be a positive integer"),
});

export function validateGetRequest(req: Request, res: Response, next: NextFunction) {
  const result = getAirplaneSchema.safeParse(req.params);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while fetching airplane",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  next();
}

const updateAirplaneSchema = z.object({
  modelNumber: z
    .string({
      message: "Model number must be a string",
    })
    .trim()
    .min(1, "Model number cannot be empty")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Model number must be alphanumeric (letters, numbers, spaces, and hyphens only)")
    .optional(),
  capacity: z
    .number({
      message: "Capacity must be a number",
    })
    .int("Capacity must be an integer")
    .gt(0, "Capacity must be greater than 0")
    .lte(1000, "Capacity must be less than or equal to 1000")
    .optional(),
}).refine((data) => data.modelNumber !== undefined || data.capacity !== undefined, {
  message: "At least one field (modelNumber or capacity) must be provided for update",
});

export function validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
  const result = updateAirplaneSchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while updating airplane",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}