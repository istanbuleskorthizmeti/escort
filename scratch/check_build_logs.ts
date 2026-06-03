import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 ERROR LOG ---');
    const errRes = await ssh.execCommand('tail -n 100 /root/.pm2/logs/drkcnay-web-cluster-error-7.log');
    console.log(errRes.stdout || errRes.stderr || 'No error log contents.');

    console.log('\n--- PM2 OUT LOG ---');
    const outRes = await ssh.execCommand('tail -n 100 /root/.pm2/logs/drkcnay-web-cluster-out-7.log');
    console.log(outRes.stdout || outRes.stderr || 'No output log contents.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkLogs();
