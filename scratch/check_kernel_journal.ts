import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkKernelJournal() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- KERNEL JOURNAL (SINCE 1 HOUR AGO) ---');
    const result = await ssh.execCommand('journalctl -k --since "1 hour ago" --no-pager');
    console.log(result.stdout || 'No kernel messages found in the last hour.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkKernelJournal();
