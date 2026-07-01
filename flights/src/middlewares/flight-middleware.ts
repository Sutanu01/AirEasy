import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error.js";
import { z } from "zod";

const createFlightSchema = z.object({
  flightNumber: z
    .string({
      message: "Flight number must be a string",
    })
    .trim()
    .min(1, "Flight number is required")
    .regex(/^[a-zA-Z0-9\-]+$/, "Flight number must be alphanumeric (letters, numbers, and hyphens only)"),
  airplaneId: z
    .number({
      message: "Airplane ID must be a number",
    })
    .int("Airplane ID must be an integer")
    .gt(0, "Airplane ID must be a positive integer"),
  departureAirportId: z
    .number({
      message: "Departure airport ID must be a number",
    })
    .int("Departure airport ID must be an integer")
    .gt(0, "Departure airport ID must be a positive integer"),
  arrivalAirportId: z
    .number({
      message: "Arrival airport ID must be a number",
    })
    .int("Arrival airport ID must be an integer")
    .gt(0, "Arrival airport ID must be a positive integer"),
  departureTime: z
    .string({
      message: "Departure time must be a string",
    })
    .datetime({
      message: "Departure time must be a valid ISO 8601 date string (e.g. YYYY-MM-DDTHH:mm:ssZ)",
    }),
  arrivalTime: z
    .string({
      message: "Arrival time must be a string",
    })
    .datetime({
      message: "Arrival time must be a valid ISO 8601 date string (e.g. YYYY-MM-DDTHH:mm:ssZ)",
    }),
  price: z
    .number({
      message: "Price must be a number",
    })
    .positive("Price must be a positive number"),
  boardingGate: z
    .string({
      message: "Boarding gate must be a string",
    })
    .trim()
    .min(1, "Boarding gate cannot be empty")
    .optional(),
})
.refine((data) => data.departureAirportId !== data.arrivalAirportId, {
  message: "Departure and arrival airports must be different",
  path: ["arrivalAirportId"],
})
.refine((data) => new Date(data.departureTime) < new Date(data.arrivalTime), {
  message: "Arrival time must be after departure time",
  path: ["arrivalTime"],
});

export function validateCreateRequest(req: Request, res: Response, next: NextFunction) {
  const result = createFlightSchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while creating flight",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}

const getFlightSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Flight ID must be a positive integer"),
});

export function validateGetRequest(req: Request, res: Response, next: NextFunction) {
  const result = getFlightSchema.safeParse(req.params);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while fetching flight",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  next();
}

const updateSeatsSchema = z.object({
  seats: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          const parsed = Number(val);
          if (!isNaN(parsed)) return parsed;
        }
        return val;
      },
      z
        .number({
          message: "Seats must be a number",
        })
        .int("Seats must be an integer")
        .gt(0, "Seats must be a positive integer")
    ),
  dec: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.toLowerCase() === "true") return true;
          if (val.toLowerCase() === "false") return false;
        }
        return val;
      },
      z.boolean({
        message: "dec must be a boolean value",
      })
    )
    .optional(),
});

export function validateUpdateSeatsRequest(req: Request, res: Response, next: NextFunction) {
  const result = updateSeatsSchema.safeParse(req.body);
  if (!result.success) {
    const explanations = result.error.issues.map((issue) => issue.message);
    return next(
      new AppError(
        "Something went wrong while updating flight seats",
        StatusCodes.BAD_REQUEST,
        explanations
      )
    );
  }

  req.body = result.data;
  next();
}
