
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 DB Connection Test Started...');
    try {
        console.log('⏳ Connecting to Prisma...');
        await prisma.$connect();
        console.log('✅ Connected successfully!');

        console.log('📊 Fetching site count...');
        const count = await prisma.site.count();
        console.log(`✅ Success! Site count: ${count}`);

        console.log('🔍 Checking first site...');
        const firstSite = await prisma.site.findFirst();
        console.log('✅ First site domain:', firstSite?.domain || 'None');

    } catch (error) {
        console.error('❌ DB Connection Failed:');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
