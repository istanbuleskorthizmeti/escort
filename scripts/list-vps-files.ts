import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    await ssh.connect(config);
    console.log('Connected.');

    const res = await ssh.execCommand('ls -la /root/esc');
    console.log('--- /root/esc ---');
    console.log(res.stdout);

    const res2 = await ssh.execCommand('ls -la /root/esc/dist');
    console.log('--- /root/esc/dist ---');
    console.log(res2.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
