import { prisma } from '../lib/prisma';

async function checkOAuth() {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'GOOGLE_OAUTH_TOKENS' },
    });
    if (setting) {
      console.log('✅ GOOGLE_OAUTH_TOKENS exists in database.');
    } else {
      console.log('❌ GOOGLE_OAUTH_TOKENS is MISSING in database.');
    }
  } catch (err: any) {
    console.error('❌ Database connection failed:', err.message);
  }
}

checkOAuth();
