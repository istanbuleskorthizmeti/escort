require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const account = await prisma.botAccount.findFirst({
            where: { platform: 'X' }
        });
        console.log(JSON.stringify(account.personaData, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
