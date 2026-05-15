import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function countFiles() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    const res = await ssh.execCommand('find /root/hydra/app -type f | wc -l');
    console.log('Remote app file count:', res.stdout.trim());
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

countFiles();
