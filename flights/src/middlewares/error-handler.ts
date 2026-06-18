import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/errors/app-error.js";
import { ErrorResponse } from "../utils/common/index.js";
import { Logger } from "../config/index.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(ErrorResponse(err.message, { statusCode: err.statusCode, explanation: err.explanation }));
  }

  Logger.error(`Unhandled Error: ${err.message || err}`, { stack: err.stack });

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(
      ErrorResponse(
        "Something went wrong on the server",
        { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, explanation: err.message || err }
      )
    );
}
