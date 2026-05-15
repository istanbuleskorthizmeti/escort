import { PrismaClient } from '@prisma/client';

async function test() {
  const urls = [
    'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable',
    'postgresql://vuc2026_user:vuc2026_pass@45.93.137.164:5432/vuc2026?sslmode=disable',
    'postgresql://vuc2026_user:vuc2026_pass@187.77.111.203:5432/vuc2026?sslmode=disable',
    'postgresql://vuc2026_user:vuc2026_pass@213.232.235.181:5432/vuc2026?sslmode=disable'
  ];

  for (const url of urls) {
    console.log(`Testing ${url}...`);
    const prisma = new PrismaClient({
      datasources: { db: { url } },
      log: ['error']
    });

    try {
      await prisma.$connect();
      console.log(`✅ SUCCESS: Connected to ${url}`);
      await prisma.$disconnect();
      return url;
    } catch (e) {
      console.log(`❌ FAILED: ${url}`);
    }
  }
  return null;
}

test();
