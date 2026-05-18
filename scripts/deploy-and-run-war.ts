import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function deployAndRunWar() {
  try {
    console.log('🚀 [WAR ROOM] Connecting to root@213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected to SSH.');

    // 1. Upload updated war script
    const localFile = 'scripts/hydra-all-out-war.ts';
    const remoteFile = '/root/esc/scripts/hydra-all-out-war.ts';
    console.log(`📤 Uploading: ${localFile} -> ${remoteFile}`);
    await ssh.putFile(path.join(process.cwd(), localFile), remoteFile);
    console.log('✅ Infiltration script uploaded.');

    // 2. Kill old war process in PM2 if exists
    console.log('🧹 [CLEANUP] Stopping old all-out-war process if active...');
    await ssh.execCommand('pm2 delete hydra-all-out-war');

    // 3. Start all-out war under PM2 management in background
    console.log('⚔️ [LAUNCH] Initiating background Hydra All-Out War SEO Blitz via PM2...');
    const pm2Res = await ssh.execCommand(
      'pm2 start "npx tsx scripts/hydra-all-out-war.ts" --name "hydra-all-out-war" --no-autorestart --node-args="--max-old-space-size=2048"',
      { cwd: '/root/esc' }
    );
    console.log(pm2Res.stdout || pm2Res.stderr);
    console.log('✅ Hydra All-Out War launched under PM2 supervision.');

    ssh.dispose();
    console.log('🏁 [WAR DEPLOY SUCCESS] Operational siege initiated in the background! Watch Telegram channels.');
  } catch (err: any) {
    console.error('💥 Error launching All-Out War:', err.message);
    ssh.dispose();
  }
}

deployAndRunWar();
