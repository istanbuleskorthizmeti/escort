import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function getLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 ERROR LOGS ---');
    const logsRes = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 100 --err --nostream');
    console.log(logsRes.stdout || logsRes.stderr || 'No error logs.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

getLogs();
