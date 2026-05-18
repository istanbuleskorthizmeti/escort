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
    
    console.log('🛑 stopping all processes in PM2 first...');
    await ssh.execCommand('pm2 stop all || true');
    await ssh.execCommand('pm2 delete all || true');

    console.log('📝 Restoring ecosystem.config.js to TSX format on the droplet...');
    await ssh.execCommand('git checkout ecosystem.config.js || true');

    console.log('🚀 Loading processes from clean ecosystem.config.js...');
    const result = await ssh.execCommand('pm2 start /root/esc/ecosystem.config.js');
    console.log(result.stdout || result.stderr || 'PM2 started.');

    console.log('💾 Saving PM2 process configurations...');
    await ssh.execCommand('pm2 save');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
