import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log(`📡 Connecting to Active Server ${config.host}...`);
    await ssh.connect(config);
    console.log('✅ Connected via SSH.');

    // 1. Ensure project directories exist
    console.log('⚙️ Ensuring directory structure...');
    await ssh.execCommand('mkdir -p /root/esc/scripts /root/esc/logs /root/esc/config');

    // 2. Upload google-enterprise-integration.ts
    console.log('📤 Uploading scripts/google-enterprise-integration.ts...');
    const localIntegrationPath = path.join(process.cwd(), 'scripts', 'google-enterprise-integration.ts');
    if (!fs.existsSync(localIntegrationPath)) {
      throw new Error(`Local script not found at: ${localIntegrationPath}`);
    }
    const integrationContent = fs.readFileSync(localIntegrationPath, 'utf8');
    const integrationB64 = Buffer.from(integrationContent).toString('base64');
    await ssh.execCommand(`echo "${integrationB64}" | base64 -d > /root/esc/scripts/google-enterprise-integration.ts`);

    // 3. Upload google-key.json
    console.log('📤 Uploading google-key.json credentials...');
    const localKeyPath = path.join(process.cwd(), 'google-key.json');
    if (fs.existsSync(localKeyPath)) {
      const keyContent = fs.readFileSync(localKeyPath, 'utf8');
      const keyB64 = Buffer.from(keyContent).toString('base64');
      await ssh.execCommand(`echo "${keyB64}" | base64 -d > /root/esc/google-key.json`);
    } else {
      console.warn('⚠️ google-key.json not found locally. Skipping transfer.');
    }

    // 4. Update .env values (Spreadsheet ID & Telegram Token)
    console.log('⚙️ Updating environmental variables on server...');
    const targetSheetId = '1_m4rqy7kxSppRB4d4EjAGeyK_VEp6YwFH0m9wN74aRI';
    const targetBotToken = '8656705130:AAFJr9QsnYASOQgIoAEEw_V8EzobjXH7nBc';
    
    // Remove old keys if they exist and append the verified working ones
    await ssh.execCommand(`sed -i '/GOOGLE_SPREADSHEET_ID/d' /root/esc/.env || true`);
    await ssh.execCommand(`sed -i '/TELEGRAM_BOT_TOKEN/d' /root/esc/.env || true`);
    await ssh.execCommand(`echo 'GOOGLE_SPREADSHEET_ID="${targetSheetId}"' >> /root/esc/.env`);
    await ssh.execCommand(`echo 'TELEGRAM_BOT_TOKEN="${targetBotToken}"' >> /root/esc/.env`);

    // 5. Deploy Cron Job on the Active Server
    console.log('⏰ Scheduling Cron Task on Active Server (09:00 AM)...');
    const cronCommand = '0 9 * * * cd /root/esc && npx tsx scripts/google-enterprise-integration.ts >> /root/esc/logs/enterprise-loop.log 2>&1';
    await ssh.execCommand(`crontab -l | grep -v 'google-enterprise-integration.ts' | { cat; echo '${cronCommand}'; } | crontab -`);

    console.log('✅ Cron task registered successfully.');

    // 6. Execute dry-run to verify the loop
    console.log('⚙️ Running test compilation and execution on Active Server...');
    const testExec = await ssh.execCommand('cd /root/esc && npx tsx scripts/google-enterprise-integration.ts');
    
    console.log('--- STDOUT ---');
    console.log(testExec.stdout);
    console.log('--- STDERR ---');
    console.log(testExec.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Migration / Verification failed:', err.message);
    ssh.dispose();
  }
}

run();
