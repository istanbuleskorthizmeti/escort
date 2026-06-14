import { prisma } from '../lib/prisma';

async function checkPbnStatus() {
  try {
    const total = await prisma.pageContent.count();
    const blogger = await prisma.pageContent.count({ where: { isBloggerPosted: true } });
    const wordpress = await prisma.pageContent.count({ where: { isWordPressPosted: true } });
    const tumblr = await prisma.pageContent.count({ where: { isTumblrPosted: true } });
    const github = await prisma.pageContent.count({ where: { isGitHubPosted: true } });
    const gist = await prisma.pageContent.count({ where: { isGistPosted: true } });
    const indexed = await prisma.pageContent.count({ where: { isIndexed: true } });

    console.log('--- PBN DEPLOYMENT METRICS ---');
    console.log(`Total Pages in DB: ${total}`);
    console.log(`Blogger Posted:   ${blogger}`);
    console.log(`WordPress Posted: ${wordpress}`);
    console.log(`Tumblr Posted:    ${tumblr}`);
    console.log(`GitHub Posted:    ${github}`);
    console.log(`Gist Posted:      ${gist}`);
    console.log(`Indexed Pages:    ${indexed}`);

  } catch (err: any) {
    console.error('❌ Failed to count PBN stats:', err.message);
  }
}

checkPbnStatus();
