import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 PM2 LOGS:');
    const result = await ssh.execCommand('tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-error-0.log');
    console.log('Instance 0 errors:\n', result.stdout || result.stderr || 'No logs');

    const result2 = await ssh.execCommand('tail -n 50 /root/.pm2/logs/drkcnay-web-cluster-error-4.log');
    console.log('Instance 4 errors:\n', result2.stdout || result2.stderr || 'No logs');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
