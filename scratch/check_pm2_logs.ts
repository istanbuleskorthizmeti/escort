import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkPm2Logs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 STDOUT LOGS (LAST 50 LINES) ---');
    const logsOut = await ssh.execCommand('tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-out-8.log || tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-out-7.log');
    console.log(logsOut.stdout || logsOut.stderr || 'No stdout logs.');

    console.log('\n--- PM2 STDERR LOGS (LAST 50 LINES) ---');
    const logsErr = await ssh.execCommand('tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-error-8.log || tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-error-7.log');
    console.log(logsErr.stdout || logsErr.stderr || 'No stderr logs.');

    console.log('\n--- LIST OF FILES IN /root/esc/ ---');
    const files = await ssh.execCommand('ls -la /root/esc');
    console.log(files.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkPm2Logs();
