import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const getDB =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = getDB;
