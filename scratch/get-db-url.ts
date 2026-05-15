import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function getDbUrl() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    const res = await ssh.execCommand('grep DATABASE_URL /var/www/escortvip/.env');
    console.log(res.stdout);
    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

getDbUrl();
