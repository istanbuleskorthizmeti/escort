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
    
    console.log('📡 Testing getMe with remote dotenv variable directly inside remote node execution...');
    const cmd = `node -r dotenv/config -e "
      const { Telegraf } = require('telegraf');
      console.log('Token to use:', process.env.TELEGRAM_BOT_TOKEN);
      const b = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
      b.telegram.getMe().then(res => console.log('GET ME SUCCESS:', res))
      .catch(err => console.error('GET ME ERROR:', err.message));
    "`;
    const result = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
