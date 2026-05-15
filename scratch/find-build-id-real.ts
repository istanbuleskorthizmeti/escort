import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function findBuildId() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    const res = await ssh.execCommand('find /root -name BUILD_ID');
    console.log(res.stdout || 'NOT FOUND');
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

findBuildId();
