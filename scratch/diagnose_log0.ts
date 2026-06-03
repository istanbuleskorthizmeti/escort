import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkNewLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PM2 ERROR LOG (LAST 50 LINES) ---');
    const err0 = await ssh.execCommand('tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-error-0.log');
    console.log(err0.stdout || err0.stderr || 'Empty.');

    console.log('\n--- PM2 OUT LOG (LAST 50 LINES) ---');
    const out0 = await ssh.execCommand('tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-out-0.log');
    console.log(out0.stdout || out0.stderr || 'Empty.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Diagnostic script failed:', err);
    ssh.dispose();
  }
}

checkNewLogs();
