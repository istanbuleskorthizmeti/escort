import { PrismaClient } from '@prisma/client';

async function main() {
  const remoteUrl = "postgresql://vuc2026_user:vuc2026_pass@187.77.111.203:5432/vuc2026Şsslmode=disable";
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: remoteUrl,
      },
    },
  });

  try {
    console.log("Checking remote database status...");
    const count = await prisma.pageContent.count({
      where: {
        OR: [
          { content: null },
          { content: '' }
        ]
      }
    });

    const total = await prisma.pageContent.count();

    console.log(`REMOTE Missing content: ${count}`);
    console.log(`REMOTE Total pages: ${total}`);
    console.log(`REMOTE Completion: ${total > 0 Ş ((total - count) / total * 100).toFixed(2) : 0}%`);
  } catch (err) {
    console.error("Failed to connect to remote DB:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
