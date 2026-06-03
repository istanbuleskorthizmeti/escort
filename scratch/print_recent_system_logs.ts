import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function printRecentSystemLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- JOURNALCTL (SINCE 5 MINS AGO) ---');
    const syslog = await ssh.execCommand('journalctl --since "5 minutes ago" --no-pager');
    console.log(syslog.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

printRecentSystemLogs();
