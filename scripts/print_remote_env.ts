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
    
    console.log('📝 Reading env keys inside remote config node process...');
    const res = await ssh.execCommand('node -r dotenv/config -e "console.log({ TOKEN: process.env.TELEGRAM_BOT_TOKEN, CHAT: process.env.TELEGRAM_CHAT_ID })"', { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
