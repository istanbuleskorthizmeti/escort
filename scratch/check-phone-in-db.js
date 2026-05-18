const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Searching for phone '5356223402' in database...");
  try {
    const profile = await prisma.adProfile.findMany({
      where: {
        phone: {
          contains: '5356223402'
        }
      }
    });
    console.log("Found in AdProfile:", profile);

    const lead = await prisma.lead.findMany({
      where: {
        details: {
          contains: '5356223402'
        }
      }
    });
    console.log("Found in Lead details:", lead);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
