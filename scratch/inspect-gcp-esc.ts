import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

async function run() {
  const ssh = new NodeSSH();
  const keyPath = path.join(process.env.USERPROFILE || 'C:\\Users\\onurk', '.ssh', 'google_compute_engine');
  
  try {
    await ssh.connect({
      host: '34.185.231.84',
      username: 'onurk',
      privateKey: fs.readFileSync(keyPath, 'utf8')
    });

    console.log('📡 Connected to GCP Server 34.185.231.84.');

    console.log('\n--- LS /home/onurk/esc ---');
    const lsEsc = await ssh.execCommand('ls -la /home/onurk/esc');
    console.log(lsEsc.stdout);

    console.log('\n--- CHECKING PM2 CURRENTLY DEFINED APPS ---');
    const pm2Show = await ssh.execCommand('pm2 show all || pm2 list');
    console.log(pm2Show.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  }
}

run();
