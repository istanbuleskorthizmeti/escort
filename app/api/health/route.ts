import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * 🛰️ DIAGNOSTICS: DRKCNAY Health Check
 * Verifies system uptime, database connectivity, and core environment.
 */
export async function GET() {
  const start = Date.now();
  let dbStatus = 'OFFLINE';
  let dbLatency = 0;

  try {
    // Attempt a fast, simple query to verify DB heartbeat
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
    dbStatus = 'ONLINE';
  } catch (err) {
    console.error('❌ HEALTH CHECK FAILURE: Database disconnected.', err);
    dbStatus = 'ERROR';
  }

  const payload = {
    status: dbStatus === 'ONLINE' ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    db: {
      status: dbStatus,
      latency: `${dbLatency}ms`
    },
    system: {
      memory: process.memoryUsage(),
      node: process.version
    },
    latency: `${Date.now() - start}ms`
  };

  const status = dbStatus === 'ONLINE' ? 200 : 503;

  return NextResponse.json(payload, { status });
}

// Ensure this route is never cached
export const dynamic = 'force-dynamic';
