import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkEscort() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    const status = await ssh.execCommand('pm2 status');
    console.log(status.stdout);
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkEscort();
