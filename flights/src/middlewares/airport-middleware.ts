import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error.js";
import { z } from "zod";

const createAirportSchema = z.object({
  airportName: z
    .string({
      message: "Airport name must be a string",
    })
    .trim()
    .min(1, "Airport name is required"),
  airportCode: z
    .string({
      message: "Airport code must be a string",
    })
    .trim()
    .min(3, "Airport code must be exactly 3 characters")
    .max(3, "Airport code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Airport code must consist of exactly 3 uppercase letters (e.g. JFK)"),
  address: z
    .string({
      message: "Address must be a string",
    })
    .trim()
    .optional(),
  cityId: z
    .number({
      message: "City ID must be a number",
    })
    .int("City ID must be an integer")
    .gt(0, "City ID must be a positive integer"),
});

const updateAirportSchema = z.object({
  airportName: z
    .string({
      message: "Airport name must be a string",
    })
    .trim()
    .min(1, "Airport name cannot be empty")
    .optional(),
  airportCode: z
    .string({
      message: "Airport code must be a string",
    })
    .trim()
    .min(3, "Airport code must be exactly 3 characters")
    .max(3, "Airport code must be exactly 3 characters")
    .regex(/^[A-Z]{3}$/, "Airport code must consist of exactly 3 uppercase letters (e.g. JFK)")
    .optional(),
  address: z
    .string({
      message: "Address must be a string",
    })
    .trim()
    .optional(),
  cityId: z
    .number({
      message: "City ID must be a number",
    })
    .int("City ID must be an integer")
    .gt(0, "City ID must be a positive integer")
    .optional(),
}).refine((data) => data.airportName !== undefined || data.airportCode !== undefined || data.address !== undefined || data.cityId !== undefined, {
  message: "At least one field (airportName, airportCode, address, or cityId) must be provided for update",
});

const getAirportSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Airport ID must be a positive integer"),
});

export function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
  const result = createAirportSchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while creating airport",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}

export function validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
  const result = updateAirportSchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while updating airport",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}

export function validateGetRequest(req: Request, res: Response, next: NextFunction) {
  const result = getAirportSchema.safeParse(req.params);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while fetching airport",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  next();
}
