import bcrypt from 'bcrypt';
import { ServerConfig } from '../../config/index.js';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, ServerConfig.SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
