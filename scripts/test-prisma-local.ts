import { prisma } from '../lib/prisma';

async function testDb() {
  try {
    const res = await prisma.systemSetting.findMany();
    console.log('✅ Connected via Prisma!');
    console.log('Settings:', res.map(r => r.key));
  } catch (err: any) {
    console.error('❌ Failed to connect via Prisma:', err.message);
  }
}

testDb();
