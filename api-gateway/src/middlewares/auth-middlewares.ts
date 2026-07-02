import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { verifyAccessToken } from '../utils/auth/token.js';
import { UserRepository } from '../repositories/index.js';
import { AppError } from '../utils/errors/app-error.js';
import { ServerConfig } from '../config/index.js';
import { StatusCodes } from 'http-status-codes';

const userRepository = new UserRepository();

const signupSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' })
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string()
});

export function validateSignupRequest(req: Request, res: Response, next: NextFunction) {
  const validation = signupSchema.safeParse(req.body);
  if (!validation.success) {
    const explanations = validation.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new AppError('Invalid signup request data', StatusCodes.BAD_REQUEST, explanations);
  }
  next();
}

export function validateLoginRequest(req: Request, res: Response, next: NextFunction) {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    const explanations = validation.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new AppError('Invalid login request data', StatusCodes.BAD_REQUEST, explanations);
  }
  next();
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization header missing or malformed', StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (error: any) {
      throw new AppError('Invalid or expired access token', StatusCodes.UNAUTHORIZED);
    }

    const user = await userRepository.get(payload.userId);
    if (!user) {
      throw new AppError('User belonging to this token no longer exists', StatusCodes.UNAUTHORIZED);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AppError('Session has expired or was revoked. Please log in again.', StatusCodes.UNAUTHORIZED);
    }

    (req as any).user = {
      userId: user.id,
      email: user.email
    };
    next();
  } catch (error) {
    next(error);
  }
}

export const authRateLimiter = rateLimit({
  windowMs: ServerConfig.RATE_LIMIT_WINDOW_MS,
  max: ServerConfig.RATE_LIMIT_MAX_REQUESTS,
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new AppError('Too many login or signup attempts. Please try again later.', StatusCodes.TOO_MANY_REQUESTS));
  },
  standardHeaders: true,
  legacyHeaders: false,
});
