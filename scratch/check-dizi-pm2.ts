import { NodeSSH } from 'node-ssh';

const server = { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function checkDizi() {
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

checkDizi();
