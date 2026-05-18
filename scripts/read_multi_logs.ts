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
    
    console.log('📡 [BOT LOGGER] Reading last 20 lines of BOT logs...');
    const botRes = await ssh.execCommand('tail -n 20 /root/.pm2/logs/hydra-telegram-bot-out.log');
    console.log(botRes.stdout || botRes.stderr || 'No out log.');

    console.log('📡 [BOT LOGGER] Reading last 20 lines of BOT error logs...');
    const botErrRes = await ssh.execCommand('tail -n 20 /root/.pm2/logs/hydra-telegram-bot-error.log');
    console.log(botErrRes.stdout || botErrRes.stderr || 'No error log.');

    console.log('📡 [WATCHDOG LOGGER] Reading last 20 lines of WATCHDOG error logs...');
    const watchErrRes = await ssh.execCommand('tail -n 20 /root/.pm2/logs/hydra-audit-watchdog-error.log');
    console.log(watchErrRes.stdout || watchErrRes.stderr || 'No watchdog error log.');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
