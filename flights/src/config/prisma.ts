import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

type PrismaGlobal = {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as unknown as PrismaGlobal;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize Prisma.');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

// PrismaClient is the database entry point for the whole app.
// Reusing a single instance prevents accidental connection-pool duplication,
// which is especially important when the server reloads during development.
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;