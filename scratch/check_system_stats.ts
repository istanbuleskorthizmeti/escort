import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkStats() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- FREE MEMORY ---');
    const freeRes = await ssh.execCommand('free -m');
    console.log(freeRes.stdout);

    console.log('\n--- DISK SPACE ---');
    const dfRes = await ssh.execCommand('df -h');
    console.log(dfRes.stdout);

    console.log('\n--- IPCS SHARED MEMORY ---');
    const ipcsRes = await ssh.execCommand('ipcs -m');
    console.log(ipcsRes.stdout);

    console.log('\n--- DMESG OOM KILLER CHECK ---');
    const oomRes = await ssh.execCommand('dmesg -T | grep -i oom | tail -n 20');
    console.log(oomRes.stdout || 'No OOM logs in dmesg.');

    console.log('\n--- POSTGRESQL STATUS & LOGS ---');
    const pgStatus = await ssh.execCommand('systemctl status postgresql');
    console.log(pgStatus.stdout);

    const pgLogs = await ssh.execCommand('tail -n 50 /var/log/postgresql/postgresql-16-main.log');
    console.log(pgLogs.stdout || pgLogs.stderr || 'No postgres logs found.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkStats();
