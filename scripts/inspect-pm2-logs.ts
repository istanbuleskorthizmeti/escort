import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 Listing PM2 log directory contents...');
    const listRes = await ssh.execCommand('ls -la /root/.pm2/logs/');
    console.log(listRes.stdout || listRes.stderr || 'No files found');

    console.log('📡 Tailing Next.js app logs...');
    const result = await ssh.execCommand('pm2 logs --lines 100 --raw --nostream');
    fs.writeFileSync('pm2_app_logs.txt', result.stdout || result.stderr || 'No logs found');
    console.log('Logs saved to pm2_app_logs.txt');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
