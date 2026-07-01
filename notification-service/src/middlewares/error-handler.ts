import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../utils/common/index.js';
import { AppError } from '../utils/errors/app-error.js';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(ErrorResponse(err.message, {
        statusCode: err.statusCode,
        explanation: err.explanation
      }));
  }

  // Fallback for standard system errors
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(ErrorResponse('Something went wrong on the server', {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      explanation: err.message || 'Internal server error occurred'
    }));
}

export { errorHandler };
