import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import { ServerConfig } from '../config/index.js';

const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie(ServerConfig.REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: ServerConfig.REFRESH_TOKEN_COOKIE_SECURE,
    sameSite: ServerConfig.REFRESH_TOKEN_COOKIE_SAMESITE,
    path: ServerConfig.REFRESH_TOKEN_COOKIE_PATH,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie(ServerConfig.REFRESH_TOKEN_COOKIE_NAME, {
    path: ServerConfig.REFRESH_TOKEN_COOKIE_PATH,
    httpOnly: true,
    sameSite: ServerConfig.REFRESH_TOKEN_COOKIE_SAMESITE,
    secure: ServerConfig.REFRESH_TOKEN_COOKIE_SECURE
  });
};

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await AuthService.signup(email, password);

    return res.status(StatusCodes.CREATED).json(SuccessResponse('Successfully registered user', user));
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(StatusCodes.OK).json(SuccessResponse('Successfully logged in', {
      user: result.user,
      accessToken: result.accessToken
    }));
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[ServerConfig.REFRESH_TOKEN_COOKIE_NAME];
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token not found',
        data: {},
        error: { explanation: 'No refresh token cookie provided' }
      });
    }

    const result = await AuthService.refresh(token);

    setRefreshTokenCookie(res, result.refreshToken);

    return res.status(StatusCodes.OK).json(SuccessResponse('Successfully rotated access token', {
      accessToken: result.accessToken
    }));
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    clearRefreshTokenCookie(res);

    return res.status(StatusCodes.OK).json(SuccessResponse('Successfully logged out', {}));
  } catch (error) {
    next(error);
  }
}

export async function logoutAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).user.userId;
    await AuthService.logoutAll(userId);

    clearRefreshTokenCookie(res);

    return res.status(StatusCodes.OK).json(SuccessResponse('Successfully logged out from all devices', {}));
  } catch (error) {
    next(error);
  }
}
