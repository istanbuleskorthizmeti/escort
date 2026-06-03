import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkWatchdogs() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- SYSTEMD ACTIVE SERVICES ---');
    const units = await ssh.execCommand('systemctl list-units --type=service --state=running');
    console.log(units.stdout);

    console.log('\n--- ACTIVE CRON JOBS ---');
    const cron = await ssh.execCommand('crontab -l 2>/dev/null || echo "No crontab for root"');
    console.log(cron.stdout);

    console.log('\n--- CRON DIRECTORIES ---');
    const cronDirs = await ssh.execCommand('ls -la /etc/cron.d /etc/cron.daily /etc/cron.hourly /etc/cron.weekly /etc/cron.monthly 2>/dev/null');
    console.log(cronDirs.stdout);

    console.log('\n--- RUNNING BASH / SH SCRIPTS ---');
    const psBash = await ssh.execCommand('ps aux | grep -E "sh|bash|python|perl" | grep -v grep');
    console.log(psBash.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkWatchdogs();
