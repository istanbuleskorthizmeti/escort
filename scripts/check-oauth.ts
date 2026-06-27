import { prisma } from '../lib/prisma';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.CRM_ENCRYPTION_KEY;
const IV_LENGTH = 16;

function decrypt(text: string) {
  if (!ENCRYPTION_KEY) return 'No Encryption Key';
  try {
    const key = Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32));
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift()!, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err: any) {
    return 'Decryption failed: ' + err.message;
  }
}

async function run() {
  console.log('Checking GOOGLE_OAUTH_TOKENS in database...');
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'GOOGLE_OAUTH_TOKENS' }
    });
    if (setting) {
      console.log('✅ GOOGLE_OAUTH_TOKENS setting exists!');
      const decrypted = decrypt(setting.value);
      try {
        const parsed = JSON.parse(decrypted);
        console.log('Parsed token keys:', Object.keys(parsed));
      } catch {
        console.log('Decrypted content (not JSON):', decrypted);
      }
    } else {
      console.log('❌ GOOGLE_OAUTH_TOKENS setting does NOT exist in database.');
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

run();
