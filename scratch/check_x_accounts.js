require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const accounts = await prisma.botAccount.findMany({
            where: { platform: 'X' }
        });

        const stats = {
            total: accounts.length,
            alive: 0,
            dead: 0,
            suspended: 0,
            other: 0
        };

        accounts.forEach(acc => {
            if (acc.status === 'ALIVE') stats.alive++;
            else if (acc.status === 'DEAD') stats.dead++;
            else if (acc.status === 'SUSPENDED') stats.suspended++;
            else stats.other++;
        });

        console.log("=== X ACCOUNT STATS ===");
        console.log(JSON.stringify(stats, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
