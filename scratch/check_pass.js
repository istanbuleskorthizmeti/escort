require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const accounts = await prisma.botAccount.findMany({
            where: { platform: 'X' }
        });

        const withPass = accounts.filter(a => a.personaData && a.personaData.password).length;
        console.log("Total X Accounts: ", accounts.length);
        console.log("Accounts with password: ", withPass);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
