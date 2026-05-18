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
    
    console.log('🛑 Deleting any existing PM2 configurations...');
    await ssh.execCommand('pm2 delete all || true');

    console.log('🚀 Starting drkcnay-web-cluster directly using ecosystem.config.js...');
    const result = await ssh.execCommand('pm2 start /root/esc/ecosystem.config.js');
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
