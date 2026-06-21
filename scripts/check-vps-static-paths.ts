import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    const res = await ssh.execCommand('ls -ld /var/www/escortvip/.next/static /root/esc/.next/static');
    console.log('Directories match check:');
    console.log(res.stdout || res.stderr);

    ssh.dispose();
  } catch (err: unknown) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
    ssh.dispose();
  }
}

run();
