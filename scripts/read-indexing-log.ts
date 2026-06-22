import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    const res = await ssh.execCommand('tail -n 50 /root/esc/logs/indexing.log');
    console.log('=== INDEXING LOG OUTPUT ===');
    console.log(res.stdout || 'Log file is empty or does not exist yet.');
    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
