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
    
    console.log('📡 Reading error logs from compiled hydra-telegram-bot process...');
    const errRes = await ssh.execCommand('tail -n 50 /root/.pm2/logs/hydra-telegram-bot-error.log');
    console.log(errRes.stdout || errRes.stderr || 'No errors.');

    console.log('📡 Reading output logs from compiled hydra-telegram-bot process...');
    const outRes = await ssh.execCommand('tail -n 50 /root/.pm2/logs/hydra-telegram-bot-out.log');
    console.log(outRes.stdout || outRes.stderr || 'No output logs.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
