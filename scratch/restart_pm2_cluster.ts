import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function restartPm2() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 RESTART ALL ---');
    const restartRes = await ssh.execCommand('pm2 restart drkcnay-web-cluster || pm2 start ecosystem.config.js');
    console.log(restartRes.stdout || restartRes.stderr);

    console.log('\n--- SLEEPING 3 SECONDS ---');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n--- PM2 STATUS ---');
    const status = await ssh.execCommand('pm2 status');
    console.log(status.stdout);

    console.log('\n--- PM2 TAIL LOGS ---');
    const logs = await ssh.execCommand('tail -n 20 /root/.pm2/logs/drkcnay-web-cluster-out-8.log || tail -n 20 /root/.pm2/logs/drkcnay-web-cluster-out-7.log');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

restartPm2();
