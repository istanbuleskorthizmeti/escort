import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkAllLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    const processes = [
      'drkcnay-web-cluster',
      'hydra-telegram-bot',
      'hydra-audit-watchdog',
      'hydra-auto-index'
    ];

    for (const proc of processes) {
      console.log(`\n--- LOGS FOR ${proc} ---`);
      const logs = await ssh.execCommand(`pm2 logs ${proc} --lines 20 --nostream`);
      console.log(logs.stdout || logs.stderr || 'No logs.');
    }

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkAllLogs();
