import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    console.log(`🚀 [DEPLOY WORKING KEYS] Connecting to VPS at ${config.host}...`);
    await ssh.connect(config);
    console.log('✅ Connected.');

    const keysToUpload = [
      'google-key-lyrical.json',
      'google-key-model-osprey.json',
      'google-key-starry.json'
    ];

    console.log('📤 Uploading working e-imza keys to VPS...');
    for (const keyFile of keysToUpload) {
      const localPath = path.join(process.cwd(), keyFile);
      if (fs.existsSync(localPath)) {
        await ssh.putFile(localPath, `/root/esc/${keyFile}`);
        await ssh.putFile(localPath, `/root/esc/dist/${keyFile}`);
        console.log(`✅ Uploaded ${keyFile} to /root/esc/ and dist/`);
      } else {
        console.warn(`⚠️ Local key file not found: ${keyFile}`);
      }
    }

    ssh.dispose();
    console.log('🏁 [COMPLETED] Working GSC keys deployed successfully to production VPS.');
  } catch (err: any) {
    console.error('❌ Deployment failed:', err.message);
    ssh.dispose();
  }
}

run();
