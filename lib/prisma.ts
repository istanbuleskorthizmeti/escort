let PrismaClient;
try {
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (e) {
  console.warn("⚠️ [PRISMA] @prisma/client not found. Using Mock client for lightweight operations.");
  PrismaClient = class {
    constructor() { return new Proxy({}, { get: () => () => Promise.resolve(null) }); }
  } as any;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

/**
 * Health check to verify database connectivity.
 * Prevents 5xx errors by allowing services to fail-fast and use fallbacks.
 */
export async function checkPrismaConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    console.error("🚨 Database connection failed:", e);
    return false;
  }
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
