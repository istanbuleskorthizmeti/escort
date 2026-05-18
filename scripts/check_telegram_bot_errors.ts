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
    
    console.log('📡 Fetching the last 50 lines of error logs from the hydra-telegram-bot process...');
    const result = await ssh.execCommand('tail -n 50 /root/.pm2/logs/hydra-telegram-bot-error.log');
    console.log(result.stdout || result.stderr || 'No errors found in PM2 logs.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
