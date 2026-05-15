import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function restartOnly() {
  console.log('⚡ [RESTART-ONLY] Cleaning up and starting hydra-web...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('✅ Connected.');

    // 1. Kill everything
    console.log('🧹 Killing old processes...');
    await ssh.execCommand('pm2 delete all || true');
    await ssh.execCommand('pkill -9 node || true');

    // 2. Start from /root/hydra
    console.log('🚀 Starting hydra-web on port 3001...');
    await ssh.execCommand('cd /root/hydra && PORT=3001 pm2 start npm --name "hydra-web" -- start');

    // 3. Check logs
    console.log('📝 Checking logs...');
    const logs = await ssh.execCommand('pm2 logs hydra-web --lines 20 --nostream');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  }
}

restartOnly();
