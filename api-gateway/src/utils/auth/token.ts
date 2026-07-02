import jwt from 'jsonwebtoken';
import { ServerConfig } from '../../config/index.js';

interface TokenPayload {
  userId: number;
  tokenVersion: number;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ServerConfig.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: ServerConfig.ACCESS_TOKEN_EXPIRY as any });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, ServerConfig.REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn: ServerConfig.REFRESH_TOKEN_EXPIRY as any });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ServerConfig.ACCESS_TOKEN_SECRET as jwt.Secret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, ServerConfig.REFRESH_TOKEN_SECRET as jwt.Secret) as TokenPayload;
}
