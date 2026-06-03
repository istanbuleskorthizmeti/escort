import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function fullKillAndClean() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- TERMINATING PM2 DAEMON ---');
    const pm2Kill = await ssh.execCommand('pm2 kill || true');
    console.log(pm2Kill.stdout || pm2Kill.stderr || 'PM2 killed.');

    console.log('\n--- KILLING ALL SUSPICIOUS PROCESSES ---');
    const killAll = await ssh.execCommand('pkill -9 -f "node|npm|next|rsyslogd-03ca3581|syslog-helper|let|lrt" || true');
    console.log(killAll.stdout || killAll.stderr || 'Processes killed.');

    console.log('\n--- REMOVING MINER DIRECTORY ---');
    const rmDir = await ssh.execCommand('rm -rf /usr/share/man/man3/.syslog-bdfd4e9f/');
    console.log(rmDir.stdout || rmDir.stderr || 'Removed miner directory.');

    console.log('\n--- RE-CHECKING RUNNING PROCESSES ---');
    const psCheck = await ssh.execCommand('ps aux | grep -E "node|npm|next|rsyslogd|syslog-helper|man3|pm2" | grep -v grep || echo "No processes found."');
    console.log(psCheck.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

fullKillAndClean();
