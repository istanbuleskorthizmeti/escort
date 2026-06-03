import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkMiner() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- EXECUTABLE PATH ---');
    const exe = await ssh.execCommand('ls -la /proc/3838005/exe');
    console.log(exe.stdout || exe.stderr);

    console.log('\n--- CMDLINE ---');
    const cmd = await ssh.execCommand('cat /proc/3838005/cmdline | tr "\\0" " "');
    console.log(cmd.stdout || cmd.stderr);

    console.log('\n--- CRON JOBS ---');
    const cron = await ssh.execCommand('crontab -l || cat /etc/crontab');
    console.log(cron.stdout || cron.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkMiner();
