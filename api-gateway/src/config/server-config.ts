import dotenv from 'dotenv';
dotenv.config();

export default {
  SERVER_PORT: process.env.SERVER_PORT || 8000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'super_secret_access_key',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'super_secret_refresh_key',
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5', 10),
  REFRESH_TOKEN_COOKIE_NAME: process.env.REFRESH_TOKEN_COOKIE_NAME || 'jid',
  REFRESH_TOKEN_COOKIE_SECURE: process.env.REFRESH_TOKEN_COOKIE_SECURE === 'true',
  REFRESH_TOKEN_COOKIE_SAMESITE: (process.env.REFRESH_TOKEN_COOKIE_SAMESITE || 'lax') as 'lax' | 'none' | 'strict',
  REFRESH_TOKEN_COOKIE_PATH: process.env.REFRESH_TOKEN_COOKIE_PATH || '/api/v1/auth'
};
