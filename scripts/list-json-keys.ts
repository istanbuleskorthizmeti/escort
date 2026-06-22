import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🔍 Listing all json files in /root:');
    const rootFiles = await ssh.execCommand('ls -la /root/*.json');
    console.log(rootFiles.stdout);

    console.log('🔍 Listing all json files in /root/esc:');
    const escFiles = await ssh.execCommand('ls -la /root/esc/*.json');
    console.log(escFiles.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
