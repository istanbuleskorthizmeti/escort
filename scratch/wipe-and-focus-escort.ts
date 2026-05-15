import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function wipeAndFocus() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Wiping /root/esc and focusing on /root/hydra...');
    
    // 1. Delete all PM2 processes
    await ssh.execCommand('pm2 delete all || true');
    await ssh.execCommand('pkill -9 node || true');

    // 2. Rename or delete /root/esc
    await ssh.execCommand('mv /root/esc /root/esc_backup_stale || true');
    console.log('✅ /root/esc moved to backup.');

    // 3. Ensure /root/hydra is current and start
    console.log('🚀 Starting hydra-web from /root/hydra...');
    await ssh.execCommand('pm2 start npm --name "hydra-web" --cwd /root/hydra -- start -- -p 3001');

    // 4. Verify
    console.log('📡 Verifying...');
    await new Promise(r => setTimeout(r, 5000));
    const netstat = await ssh.execCommand('netstat -tulpn | grep 3001');
    console.log(netstat.stdout || '❌ Still not listening on 3001!');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

wipeAndFocus();
