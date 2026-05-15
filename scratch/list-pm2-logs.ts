import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function listLogs() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📂 Listing PM2 Logs...');
    const res = await ssh.execCommand('ls -la /root/.pm2/logs');
    console.log(res.stdout);
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

listLogs();
