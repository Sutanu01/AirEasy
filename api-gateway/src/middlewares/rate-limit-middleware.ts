import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/errors/app-error.js';
import { ServerConfig } from '../config/index.js';
import { StatusCodes } from 'http-status-codes';

export const globalRateLimiter = rateLimit({
  windowMs: ServerConfig.GLOBAL_RATE_LIMIT_WINDOW_MS,
  max: ServerConfig.GLOBAL_RATE_LIMIT_MAX_REQUESTS,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Too many requests. Please try again later.', StatusCodes.TOO_MANY_REQUESTS));
  },
  standardHeaders: true,
  legacyHeaders: false,
});
