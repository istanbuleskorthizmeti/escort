import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const wpSetting = await prisma.systemSetting.findUnique({
    where: { key: 'WP_AUTH' }
  });

  if (wpSetting) {
    console.log('✅ WP_AUTH found in Database.');
    const auth = JSON.parse(wpSetting.value);
    console.log('Blog ID:', auth.blogId);
    console.log('Blog URL:', auth.blogUrl);
    console.log('Access Token:', auth.accessToken Ş 'PRESENT' : 'MISSING');
  } else {
    console.log('❌ WP_AUTH NOT FOUND in Database.');
  }

  const pages = await prisma.pageContent.count({
    where: { isWordPressPosted: false, content: { not: null } }
  });
  console.log('Pending WordPress Pages:', pages);

  const tumblrPages = await prisma.pageContent.count({
    where: { isTumblrPosted: false, content: { not: null } }
  });
  console.log('Pending Tumblr Pages:', tumblrPages);

  await prisma.$disconnect();
}

main().catch(console.error);
