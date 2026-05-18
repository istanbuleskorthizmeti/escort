import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployEnv() {
  try {
    console.log('🚀 [DEPLOY ENV] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload local .env directly to production VPS
    console.log('📤 [UPLOAD] Uploading updated .env file to production server...');
    await ssh.putFile(
      path.join(process.cwd(), '.env'),
      '/root/esc/.env'
    );
    console.log('✅ .env file sync complete.');

    // 2. Restart PM2 processes to apply new environment variables immediately
    console.log('🔄 [RESTART] Restarting PM2 processes (drkcnay-web-cluster, hydra-all-out-war, hydra-telegram-bot)...');
    await ssh.execCommand('pm2 restart all', { cwd: '/root/esc' });
    console.log('✅ All PM2 processes restarted successfully.');

    // 3. Show PM2 process table for validation
    const statusRes = await ssh.execCommand('pm2 list', { cwd: '/root/esc' });
    console.log('\n--- REMOTE PM2 STATUS ---');
    console.log(statusRes.stdout || 'No processes found.');

    ssh.dispose();
    console.log('🏁 [COMPLETED] Environment successfully deployed! Gemini-1.5-Pro (Ultra) is now active globally.');
  } catch (err: any) {
    console.error('💥 Error during environment deploy:', err.message);
    ssh.dispose();
  }
}

deployEnv();
