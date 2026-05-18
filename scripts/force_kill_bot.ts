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
    
    console.log('🛑 Terminating all processes matching telegram-master across the droplet...');
    await ssh.execCommand('pkill -9 -f "telegram-master" || true');
    
    console.log('🔄 Restarting PM2 hydra-telegram-bot daemon cleanly...');
    await ssh.execCommand('pm2 restart hydra-telegram-bot');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
