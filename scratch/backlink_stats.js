
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.pageContent.count();
    const blogger = await prisma.pageContent.count({ where: { isBloggerPosted: true } });
    const tumblr = await prisma.pageContent.count({ where: { isTumblrPosted: true } });
    const wordpress = await prisma.pageContent.count({ where: { isWordPressPosted: true } });
    
    const unpostedBlogger = await prisma.pageContent.count({ where: { isBloggerPosted: false, content: { not: null } } });
    const unpostedTumblr = await prisma.pageContent.count({ where: { isTumblrPosted: false, content: { not: null } } });
    const unpostedWordPress = await prisma.pageContent.count({ where: { isWordPressPosted: false, content: { not: null } } });

    console.log(`--- DATABASE BACKLINK STATS ---`);
    console.log(`Total Pages: ${total}`);
    console.log(`Blogger Posted: ${blogger} (Pending: ${unpostedBlogger})`);
    console.log(`Tumblr Posted: ${tumblr} (Pending: ${unpostedTumblr})`);
    console.log(`WordPress Posted: ${wordpress} (Pending: ${unpostedWordPress})`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
