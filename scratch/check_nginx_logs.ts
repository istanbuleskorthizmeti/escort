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

    console.log('\n--- NGINX RECENT ERROR LOGS (LAST 30 LINES) ---');
    const errRes = await ssh.execCommand('tail -n 30 /var/log/nginx/error.log');
    console.log(errRes.stdout || errRes.stderr || 'No error logs.');

    console.log('\n--- NGINX RECENT ACCESS LOGS (LAST 30 LINES) ---');
    const accessRes = await ssh.execCommand('tail -n 30 /var/log/nginx/access.log');
    console.log(accessRes.stdout || accessRes.stderr || 'No access logs.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkLogs();
