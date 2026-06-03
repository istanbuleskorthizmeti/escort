import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkErrors() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 LOGS DIRECT FILE TAIL ---');
    const logs = await ssh.execCommand('tail -n 100 /root/.pm2/logs/drkcnay-web-cluster-error-8.log || tail -n 100 /root/.pm2/logs/drkcnay-web-cluster-error-7.log');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkErrors();
