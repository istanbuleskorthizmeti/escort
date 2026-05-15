import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function test() {
  try {
    const settings = await (prisma as any).systemSetting.findMany();
    console.log("Settings found:", settings.length);
    console.log("Keys:", settings.map((s: any) => s.key));
  } catch (e: any) {
    console.error("Database error:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}
test();
