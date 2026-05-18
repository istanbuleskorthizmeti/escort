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
    
    console.log('📡 [PM2 LIST] Checking Telegram process status...');
    const pm2Res = await ssh.execCommand('pm2 show hydra-telegram-bot || pm2 list');
    console.log(pm2Res.stdout || pm2Res.stderr || 'No response');

    console.log('📡 [ENV CHECK] Checking Telegram environment variables...');
    const envRes = await ssh.execCommand('grep -E "TELEGRAM_" /root/esc/.env || echo "No Telegram env found"');
    console.log(envRes.stdout || envRes.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
