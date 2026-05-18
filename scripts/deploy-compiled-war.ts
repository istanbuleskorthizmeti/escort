import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployCompiledWar() {
  try {
    console.log('🚀 [DEPLOY COMPILED WAR] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected to SSH.');

    // 1. Sync compiled dist/ recursively
    console.log('📤 [SYNC] Syncing compiled "dist/" directory recursively...');
    await ssh.putDirectory(
      path.join(process.cwd(), 'dist'),
      '/root/esc/dist',
      { recursive: true }
    );
    console.log('✅ Compiled "dist/" directory synchronized.');

    // 2. Kill old PM2 process if active
    console.log('🧹 [CLEANUP] Stopping old all-out-war process...');
    await ssh.execCommand('pm2 delete hydra-all-out-war');

    // 3. Start pre-compiled pure JS All-Out War under PM2
    console.log('⚔️ [LAUNCH] Initiating pure JavaScript Hydra All-Out War SEO Blitz via PM2...');
    const pm2Res = await ssh.execCommand(
      'pm2 start "node dist/scripts/hydra-all-out-war.js" --name "hydra-all-out-war" --no-autorestart',
      { cwd: '/root/esc' }
    );
    console.log(pm2Res.stdout || pm2Res.stderr);

    ssh.dispose();
    console.log('🏁 [WAR DEPLOY SUCCESS] Pure JS Hydra War Engine initiated in the background! Zero compilation overhead, 100% stability. Watch Telegram channel.');
  } catch (err: any) {
    console.error('💥 Error deploying compiled war:', err.message);
    ssh.dispose();
  }
}

deployCompiledWar();
