import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function syncAll() {
  try {
    console.log('🚀 [SYNC] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected to SSH.');

    // 1. Sync lib/ recursively
    console.log('📤 [SYNC] Syncing "lib/" directory recursively...');
    await ssh.putDirectory(
      path.join(process.cwd(), 'lib'),
      '/root/esc/lib',
      { recursive: true }
    );
    console.log('✅ "lib/" directory synchronized.');

    // 2. Sync config/ recursively
    console.log('📤 [SYNC] Syncing "config/" directory recursively...');
    await ssh.putDirectory(
      path.join(process.cwd(), 'config'),
      '/root/esc/config',
      { recursive: true }
    );
    console.log('✅ "config/" directory synchronized.');

    // 3. Sync scripts/ recursively
    console.log('📤 [SYNC] Syncing "scripts/" directory recursively...');
    await ssh.putDirectory(
      path.join(process.cwd(), 'scripts'),
      '/root/esc/scripts',
      { recursive: true }
    );
    console.log('✅ "scripts/" directory synchronized.');

    // 4. Delete old PM2 war process
    console.log('🧹 [CLEANUP] Stopping old all-out-war process...');
    await ssh.execCommand('pm2 delete hydra-all-out-war');

    // 5. Start the Hydra All-Out War using our bulletproof CommonJS ts-node runner under PM2
    console.log('⚔️ [LAUNCH] Initiating background Hydra All-Out War SEO Blitz via PM2...');
    const pm2Res = await ssh.execCommand(
      'pm2 start "npx ts-node -O \'{\\"module\\": \\"commonjs\\"}\' scripts/hydra-all-out-war.ts" --name "hydra-all-out-war" --no-autorestart',
      { cwd: '/root/esc' }
    );
    console.log(pm2Res.stdout || pm2Res.stderr);

    ssh.dispose();
    console.log('🏁 [WAR LAUNCH SUCCESS] All files synced and Hydra All-Out War initiated in the background! Real-time notifications will flood Telegram.');
  } catch (err: any) {
    console.error('💥 Error during synchronization and launch:', err.message);
    ssh.dispose();
  }
}

syncAll();
