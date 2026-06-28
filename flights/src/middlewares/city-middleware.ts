import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error.js";
import { z } from "zod";

const createCitySchema = z.object({
  cityName: z
    .string({
      message: "City name must be a string",
    })
    .trim()
    .min(1, "City name is required")
    .regex(/^[a-zA-Z\s\-]+$/, "City name must contain only letters, spaces, and hyphens"),
});

const updateCitySchema = z.object({
  cityName: z
    .string({
      message: "City name must be a string",
    })
    .trim()
    .min(1, "City name is required")
    .regex(/^[a-zA-Z\s\-]+$/, "City name must contain only letters, spaces, and hyphens"),
});

const getCitySchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "City ID must be a positive integer"),
});

export function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
  const result = createCitySchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while creating city",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}

export function validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
  const result = updateCitySchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while updating city",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}

export function validateGetRequest(req: Request, res: Response, next: NextFunction) {
  const result = getCitySchema.safeParse(req.params);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while fetching city",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  next();
}
