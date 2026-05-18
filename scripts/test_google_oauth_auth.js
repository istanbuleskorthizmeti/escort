require('dotenv').config();

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('213.232.235.181')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
}

const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const prisma = new PrismaClient();

async function run() {
  console.log('🔍 Checking database for GOOGLE_OAUTH_TOKENS...');
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'GOOGLE_OAUTH_TOKENS' }
    });
    
    if (!setting) {
      console.log('❌ [OAUTH] GOOGLE_OAUTH_TOKENS key NOT found in database!');
    } else {
      console.log('✅ [OAUTH] GOOGLE_OAUTH_TOKENS key found!');
    }
  } catch (err) {
    console.error('❌ DB Error:', err.message);
  }
  await prisma.$disconnect();
}

run();
