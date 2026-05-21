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

    console.log('\n--- LS HOME DIRECTORY ---');
    const lsHome = await ssh.execCommand('ls -la /home/onurk');
    console.log(lsHome.stdout);

    console.log('\n--- LS ROOT DIRECTORY (WITH SUDO) ---');
    const lsRoot = await ssh.execCommand('sudo ls -la /root');
    console.log(lsRoot.stdout);

    console.log('\n--- CHECKING SYSTEM SERVICES ---');
    const nginxStatus = await ssh.execCommand('systemctl is-active nginx');
    console.log('Nginx Active Status:', nginxStatus.stdout.trim());

    const postgresStatus = await ssh.execCommand('systemctl is-active postgresql');
    console.log('PostgreSQL Active Status:', postgresStatus.stdout.trim());

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  }
}

run();
