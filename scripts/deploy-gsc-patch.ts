import { NodeSSH } from 'node-ssh';
import * as path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected to VPS.');

    const localScriptPath = path.resolve('scripts/fleet-gsc-automation.ts');
    const remoteScriptPath = '/root/esc/scripts/fleet-gsc-automation.ts';

    console.log('📤 Uploading updated scripts/fleet-gsc-automation.ts to VPS...');
    await ssh.putFile(localScriptPath, remoteScriptPath);
    console.log('✅ Uploaded scripts/fleet-gsc-automation.ts to VPS.');

  } catch (err: any) {
    console.error('💥 Deploy GSC Patch Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
