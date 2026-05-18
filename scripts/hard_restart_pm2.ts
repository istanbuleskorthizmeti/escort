import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('🛑 [PM2 DELETE] Deleting all running instances...');
    await ssh.execCommand('pm2 delete all');

    console.log('🧹 [NATIVE SWEEPER] Pre-clearing any rogue next-server or node processes...');
    await ssh.execCommand('pkill -9 -f next-server || true');
    await ssh.execCommand('pkill -9 -f next-router-worker || true');
    
    console.log('🚀 [PM2 START] Starting ecosystem config fresh...');
    const result = await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr || 'PM2 started.');

    console.log('🧹 [PURGE] Purging Nginx cache...');
    await ssh.execCommand('rm -rf /var/cache/nginx/* && systemctl reload nginx');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
