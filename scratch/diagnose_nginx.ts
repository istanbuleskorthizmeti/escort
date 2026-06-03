import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkNginxLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- NGINX ERROR LOG (LAST 40 LINES) ---');
    const nginxErr = await ssh.execCommand('tail -n 40 /var/log/nginx/error.log');
    console.log(nginxErr.stdout || nginxErr.stderr || 'No Nginx error logs.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Error reading logs:', err);
    ssh.dispose();
  }
}

checkNginxLogs();
