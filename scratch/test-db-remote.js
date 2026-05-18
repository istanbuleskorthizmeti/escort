const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Testing database connection on remote...");
  try {
    const count = await prisma.pageContent.count();
    console.log("✅ Success! Total pageContent rows:", count);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
