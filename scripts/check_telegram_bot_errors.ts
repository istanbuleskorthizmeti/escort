import { connectSSH } from './lib/ssh-helper';

async function run() {
  let ssh;
  try {
    ssh = await connectSSH();
    console.log('✅ Connected to Active VPS.');
    
    console.log('📡 Fetching the last 50 lines of error logs from the hydra-telegram-bot process...');
    const result = await ssh.execCommand('tail -n 50 /root/.pm2/logs/hydra-telegram-bot-error.log');
    console.log(result.stdout || result.stderr || 'No errors found in PM2 logs.');

    if (ssh) ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    if (ssh) ssh.dispose();
  }
}

run();
