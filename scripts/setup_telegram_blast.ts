import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📤 Uploading updated telegram-master.ts...');
    const localMaster = fs.readFileSync(path.join(process.cwd(), 'scripts', 'master', 'telegram-master.ts'), 'utf8');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/master/telegram-master.ts\n${localMaster}\nEOF`);

    console.log('🛑 Stopping any running telegram-blast tasks in PM2...');
    await ssh.execCommand('pm2 stop telegram-blast || true');
    await ssh.execCommand('pm2 delete telegram-blast || true');

    console.log('🚀 Launching automated hourly telegram-blast cron job in PM2...');
    // Runs every 1 hour (0 * * * *) to post profiles to Telegram
    const cronRes = await ssh.execCommand('pm2 start npx --name "telegram-blast" --cron "0 * * * *" --no-autorestart -- tsx scripts/master/telegram-blast.ts', { cwd: '/root/esc' });
    console.log(cronRes.stdout || cronRes.stderr || 'PM2 started.');

    console.log('🔄 Restarting hydra-telegram-bot to apply crash fixes...');
    await ssh.execCommand('pm2 restart hydra-telegram-bot');

    console.log('💾 Saving PM2 process list...');
    await ssh.execCommand('pm2 save');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
