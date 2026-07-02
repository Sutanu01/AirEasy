import { UserRepository } from '../repositories/index.js';
import { hashPassword, comparePassword } from '../utils/auth/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth/token.js';
import { AppError } from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { Logger } from '../config/index.js';

const userRepository = new UserRepository();

export async function signup(email: string, password: string) {
  try {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('A user with this email already exists', StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(password);
    const user = await userRepository.create({
      email,
      password: hashedPassword
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    };
  } catch (error: any) {
    Logger.error("Signup error details:");
    Logger.error(error.stack || error.message || error);
    if (error.code) Logger.error(`Prisma error code: ${error.code}`);
    if (error.meta) Logger.error(`Prisma error meta: ${JSON.stringify(error.meta)}`);
    if (error instanceof AppError) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new AppError('A user with this email already exists', StatusCodes.BAD_REQUEST);
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError('Cannot register a new user object', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
    }

    const payload = { userId: user.id, tokenVersion: user.tokenVersion };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken
    };
  } catch (error) {
    Logger.error(error);
    if (error instanceof AppError) throw error;
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError('Cannot authenticate the user request', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function refresh(token: string) {
  try {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch (error: any) {
      throw new AppError('Invalid or expired refresh token', StatusCodes.UNAUTHORIZED);
    }

    const user = await userRepository.get(payload.userId);
    if (!user) {
      throw new AppError('User not found', StatusCodes.UNAUTHORIZED);
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new AppError('Token has been revoked', StatusCodes.UNAUTHORIZED);
    }

    const tokenPayload = { userId: user.id, tokenVersion: user.tokenVersion };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    Logger.error(error);
    if (error instanceof AppError) throw error;
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError('Cannot refresh token details', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function logoutAll(userId: number) {
  try {
    const user = await userRepository.get(userId);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }

    await userRepository.incrementTokenVersion(userId);
  } catch (error) {
    Logger.error(error);
    if (error instanceof AppError) throw error;
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError('Cannot perform global logout operations', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
