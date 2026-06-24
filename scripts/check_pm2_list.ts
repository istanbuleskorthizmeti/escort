import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

import fs from 'fs';

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 Listing active PM2 daemons...');
    const result = await ssh.execCommand('pm2 list');
    fs.writeFileSync('pm2_status.txt', result.stdout || result.stderr || 'No response');
    console.log('Saved to pm2_status.txt');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
