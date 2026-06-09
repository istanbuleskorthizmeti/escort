import { NodeSSH } from 'node-ssh';
import fs from 'fs';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 Listing PM2 log directory contents...');
    const listRes = await ssh.execCommand('ls -la /root/.pm2/logs/');
    console.log(listRes.stdout || listRes.stderr || 'No files found');

    console.log('📡 Tailing multi-server-bomber-error.log...');
    const result = await ssh.execCommand('tail -n 50 /root/.pm2/logs/multi-server-bomber-error.log');
    fs.writeFileSync('bomber_logs.txt', result.stdout || result.stderr || 'No logs found');
    console.log('Logs saved to bomber_logs.txt');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
