import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function restartPrecise() {
  console.log('⚡ [RESTART-PRECISE] Starting hydra-web with explicit CWD and Port...');

  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('✅ Connected.');

    // 1. Kill everything again to be sure
    await ssh.execCommand('pm2 delete all || true');
    await ssh.execCommand('pkill -9 node || true');

    // 2. Start with explicit cwd and port arg
    console.log('🚀 Launching...');
    await ssh.execCommand('pm2 start npm --name "hydra-web" --cwd /root/hydra -- start -- -p 3001');

    // 3. Verify
    console.log('📡 Verifying port 3001...');
    await new Promise(r => setTimeout(r, 3000)); // Wait for it to bind
    const netstat = await ssh.execCommand('netstat -tulpn | grep 3001');
    console.log(netstat.stdout || '❌ NOT LISTENING ON 3001!');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 FAILURE:', err.message);
  }
}

restartPrecise();
