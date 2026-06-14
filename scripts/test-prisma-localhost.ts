import { prisma } from '../lib/prisma';

async function testLocalDb() {
  process.env.DATABASE_URL = 'postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable';
  
  try {
    const res = await prisma.systemSetting.findMany();
    console.log('✅ Connected via Prisma on localhost!');
    console.log('Settings:', res.map(r => r.key));
  } catch (err: any) {
    console.error('❌ Failed to connect via Prisma on localhost:', err.message);
  }
}

testLocalDb();
