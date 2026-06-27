import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

const jsCodePayload = `
const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split(/\\r?\\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const index = trimmed.indexOf('=');
        if (index > 0) {
          const key = trimmed.substring(0, index).trim();
          let val = trimmed.substring(index + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          process.env[key] = val;
        }
      }
    }
  } catch (err) {
    console.error('Error loading env:', err.message);
  }
}

loadEnv();

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('213.232.235.181', 'localhost');
}

const prisma = new PrismaClient();

const CRM_ENCRYPTION_KEY = process.env.CRM_ENCRYPTION_KEY;
const IV_LENGTH = 16;

function getKeyBuffer() {
  if (!CRM_ENCRYPTION_KEY) {
    throw new Error('CRM_ENCRYPTION_KEY is required for Google OAuth token encryption');
  }
  return Buffer.from(CRM_ENCRYPTION_KEY.padEnd(32).slice(0, 32));
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', getKeyBuffer(), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const TARGET_SERVICE_ACCOUNTS = [
  'e-imza-336@lyrical-edition-500119-s3.iam.gserviceaccount.com',
  'eimza-362@model-osprey-500119-v9.iam.gserviceaccount.com',
  'eimza-390@starry-hearth-500119-u2.iam.gserviceaccount.com'
];

async function run() {
  console.log('🚀 [GSC VPS OWNER PROMOTION] Starting...');
  
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: 'GOOGLE_OAUTH_TOKENS' }
    });

    if (!setting) {
      console.error('❌ GOOGLE_OAUTH_TOKENS not found in database!');
      return;
    }

    const tokens = JSON.parse(decrypt(setting.value));
    console.log('✅ Tokens decrypted successfully.');

    const oauthClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauthClient.setCredentials(tokens);

    const siteVerification = google.siteVerification({
      version: 'v1',
      auth: oauthClient
    });

    console.log('📡 Fetching list of verified web resources...');
    const listRes = await siteVerification.webResource.list({});
    const items = listRes.data.items || [];
    console.log(\`📋 Found \${items.length} verified web resources.\`);

    for (const item of items) {
      const identifier = item.site.identifier || '';
      const resourceId = item.id || '';
      
      const isTarget = identifier.includes('sites.google.com/dorukcanay.digital') || 
                       identifier.includes('istanbul-escort.readme.io');
      
      if (!isTarget) {
        continue;
      }

      console.log(\`\\n⚙️ Processing resource: \${identifier} (ID: \${resourceId})\`);
      const currentOwners = item.owners || [];
      console.log(\`   Current owners:\`, currentOwners);

      const ownersSet = new Set(currentOwners);
      let needsUpdate = false;

      for (const sa of TARGET_SERVICE_ACCOUNTS) {
        if (!ownersSet.has(sa)) {
          ownersSet.add(sa);
          needsUpdate = true;
          console.log(\`   ➕ Adding: \${sa}\`);
        }
      }

      if (needsUpdate) {
        const updatedOwners = Array.from(ownersSet);
        try {
          console.log(\`   📡 Sending update request...\`);
          const updateRes = await siteVerification.webResource.update({
            id: resourceId,
            requestBody: {
              site: item.site,
              owners: updatedOwners
            }
          });
          console.log(\`   ✅ Success! Updated owners:\`, updateRes.data.owners);
        } catch (err) {
          console.error(\`   ❌ Failed to update owners:\`, err.message);
        }
      } else {
        console.log(\`   ℹ️ All target service accounts are already owners.\`);
      }
    }

  } catch (err) {
    console.error('💥 Critical error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
`;

async function main() {
  try {
    console.log(`🚀 Connecting to VPS at ${config.host}...`);
    await ssh.connect(config);
    console.log('✅ Connected.');

    const remotePath = '/root/esc/scripts/promote-owners-vps.js';
    console.log(`📤 Writing script payload on VPS at ${remotePath}...`);
    await ssh.execCommand(`cat << 'EOF' > ${remotePath}\n${jsCodePayload}\nEOF`);
    console.log('✅ Script written.');

    console.log('⚡ Executing promote-owners-vps.js on VPS...');
    const result = await ssh.execCommand('node scripts/promote-owners-vps.js', {
      cwd: '/root/esc'
    });

    console.log('\n--- VPS EXECUTION OUTPUT ---');
    console.log(result.stdout || 'No stdout.');
    if (result.stderr) {
      console.error('\n--- VPS EXECUTION ERRORS ---');
      console.error(result.stderr);
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Failed:', err.message);
    ssh.dispose();
  }
}

main();
