import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('📡 Connected to secondary attack server.');
    console.log('📡 Fetching logs of escortvip-bot...');
    
    const result = await ssh.execCommand('pm2 logs escortvip-bot --lines 100 --raw || tail -n 100 /root/.pm2/logs/escortvip-bot-out.log');
    console.log('--- RECENT BOT LOGS ---');
    console.log(result.stdout || result.stderr || 'No logs found.');

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

run();
