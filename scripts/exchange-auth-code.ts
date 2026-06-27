import { google } from 'googleapis';
import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.CRM_ENCRYPTION_KEY;
const IV_LENGTH = 16;

function getKeyBuffer() {
  if (!ENCRYPTION_KEY) {
    throw new Error('CRM_ENCRYPTION_KEY is required for Google OAuth token encryption');
  }
  return Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));
}

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', getKeyBuffer(), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

async function run() {
  const code = 'ca26c4d7f7889d2898bc';
  console.log(`🔌 Attempting to exchange auth code: ${code}`);

  const clientIds = [
    process.env.GOOGLE_CLIENT_ID || '279960646827-n81r57arr7ikvjcbs2ooc08om5kppkm7.apps.googleusercontent.com'
  ];
  const clientSecrets = [
    process.env.GOOGLE_CLIENT_SECRET || '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'
  ];

  // Try redirect URIs: http://127.0.0.1:57602 and http://127.0.0.1:57602/
  const redirectUris = [
    'http://127.0.0.1:57602',
    'http://127.0.0.1:57602/',
    'http://localhost:57602',
    'http://localhost:57602/',
  ];

  let success = false;
  let tokens: any = null;

  for (const redirectUri of redirectUris) {
    console.log(`🌐 Trying redirect URI: ${redirectUri}`);
    const oauth2Client = new google.auth.OAuth2(
      clientIds[0],
      clientSecrets[0],
      redirectUri
    );

    try {
      const res = await oauth2Client.getToken(code);
      tokens = res.tokens;
      console.log('✅ Tokens retrieved successfully!');
      console.log('Tokens:', JSON.stringify(tokens, null, 2));
      success = true;
      break;
    } catch (err: any) {
      console.warn(`⚠️ Failed with redirect URI ${redirectUri}:`, err.message);
    }
  }

  if (success && tokens) {
    console.log('💾 Saving tokens to database...');
    const encryptedTokens = encrypt(JSON.stringify(tokens));
    
    await prisma.systemSetting.upsert({
      where: { key: 'GOOGLE_OAUTH_TOKENS' },
      update: { 
        value: encryptedTokens,
        updatedAt: new Date()
      },
      create: { 
        key: 'GOOGLE_OAUTH_TOKENS', 
        value: encryptedTokens 
      },
    });

    console.log('🎉 Google OAuth tokens successfully saved to the database!');
  } else {
    console.error('❌ Could not exchange auth code with any redirect URI combination.');
  }

  await prisma.$disconnect();
}

run().catch(console.error);
