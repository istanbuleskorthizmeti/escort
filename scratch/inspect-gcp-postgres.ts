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

    console.log('\n--- LISTING POSTGRES DATABASES ---');
    const pgList = await ssh.execCommand('sudo -u postgres psql -c "\\l"');
    console.log(pgList.stdout || pgList.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  }
}

run();
