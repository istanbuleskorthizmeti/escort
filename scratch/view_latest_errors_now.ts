import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function viewLatestErrors() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEM ERRORS (LAST 30 LINES) ---');
    const logs = await ssh.execCommand('tail -n 30 /root/.pm2/logs/drkcnay-web-cluster-error-8.log');
    console.log(logs.stdout || logs.stderr || 'No error logs found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

viewLatestErrors();
