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

    const res = await ssh.execCommand('ls -la /home/onurk/esc/esc_codebase.zip || echo "Not found"');
    console.log('Zip file details on GCP:', res.stdout.trim());

    ssh.dispose();
  } catch (err: any) {
    console.error('SSH check failed:', err.message);
  }
}

run();
