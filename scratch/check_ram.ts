import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkRAM() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- FREE -M ---');
    const freeRes = await ssh.execCommand('free -m');
    console.log(freeRes.stdout);

    console.log('\n--- DMESG OOM CHECK ---');
    const dmesgRes = await ssh.execCommand('dmesg -T | grep -i -E "oom|killed" | tail -n 15');
    console.log(dmesgRes.stdout || 'No OOM entries in dmesg.');

    console.log('\n--- VERIFYING KERNEL SYS LOGS ---');
    const grepSyslog = await ssh.execCommand('grep -i -E "oom|killed" /var/log/syslog | tail -n 15');
    console.log(grepSyslog.stdout || grepSyslog.stderr || 'No matches in syslog.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkRAM();
