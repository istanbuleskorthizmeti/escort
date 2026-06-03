import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkKernelLogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- DMESG (LAST 30 LINES OF KILLED/OOM) ---');
    const dmesgRes = await ssh.execCommand('dmesg -T | grep -i -E "oom|kill|killed|sigkill" | tail -n 30');
    console.log(dmesgRes.stdout || 'No matching dmesg lines found.');

    console.log('\n--- JOURNALCTL (LAST 100 LINES) ---');
    const journalRes = await ssh.execCommand('journalctl -n 100 --no-pager');
    console.log(journalRes.stdout || 'No journal entries found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkKernelLogs();
