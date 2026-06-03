import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkInstanceLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- FINDING ACTUAL LOG PATHS FROM PM2 ---');
    const pm2Desc = await ssh.execCommand('pm2 describe drkcnay-web-cluster');
    console.log(pm2Desc.stdout);

    console.log('\n--- TAILING ERR LOGS ---');
    const errLog = await ssh.execCommand('tail -n 30 /root/.pm2/logs/drkcnay-web-cluster-error-8.log');
    console.log(errLog.stdout || errLog.stderr);

    console.log('\n--- TAILING OUT LOGS ---');
    const outLog = await ssh.execCommand('tail -n 30 /root/.pm2/logs/drkcnay-web-cluster-out-8.log');
    console.log(outLog.stdout || outLog.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkInstanceLogs();
