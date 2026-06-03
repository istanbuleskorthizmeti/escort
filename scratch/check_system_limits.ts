import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSystemLimits() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- KERNEL MEMORY LIMITS ---');
    const ulimitRes = await ssh.execCommand('ulimit -a');
    console.log(ulimitRes.stdout);

    console.log('\n--- MONIT SYSTEM LOGS FOR KILLED EVENTS ---');
    const logCheck = await ssh.execCommand('grep -i -C 3 -E "kill" /var/log/syslog | tail -n 30');
    console.log(logCheck.stdout || logCheck.stderr || 'No syslog matches.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSystemLimits();
