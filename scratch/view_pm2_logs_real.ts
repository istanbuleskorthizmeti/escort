import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function viewLogsReal() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LISTING LOGS IN /root/.pm2/logs/ ---');
    const lsRes = await ssh.execCommand('ls -la /root/.pm2/logs/');
    console.log(lsRes.stdout);

    console.log('\n--- READING TAIL OF ERRORS FOR THE CLUSTER ---');
    const logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 40 --raw --no-colors');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

viewLogsReal();
