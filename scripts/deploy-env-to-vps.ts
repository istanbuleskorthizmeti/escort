import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';
import path from 'path';
import fs from 'fs';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    console.log(`🚀 Connecting to VPS at ${config.host} to upload .env...`);
    await ssh.connect(config);
    console.log('✅ Connected.');

    const localEnv = path.join(process.cwd(), '.env');
    const remoteEnv = '/root/esc/.env';

    if (fs.existsSync(localEnv)) {
      console.log('📤 Uploading .env file to VPS...');
      await ssh.putFile(localEnv, remoteEnv);
      console.log('✅ .env uploaded successfully.');
    } else {
      console.error('❌ Local .env file not found!');
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Failed:', err.message);
    ssh.dispose();
  }
}

run();
