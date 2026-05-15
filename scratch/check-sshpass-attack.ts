import { NodeSSH } from 'node-ssh';

const server = { host: '187.77.111.203', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function checkSshPass() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    const res = await ssh.execCommand('sshpass -V');
    console.log(res.stdout ? 'SSHPASS INSTALLED' : 'NOT FOUND');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkSshPass();
