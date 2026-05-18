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
    
    console.log('🚀 Activating the automated hourly visual SEO blast daemon in PM2...');
    // We will start the compiled javascript file (telegram-blast.js) using the node runner and a cron schedule
    const result = await ssh.execCommand('pm2 start node --name "telegram-blast" --cron "0 * * * *" -- -r dotenv/config /root/esc/dist_scripts/scripts/master/telegram-blast.js', { cwd: '/root/esc' });
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
