const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking remote cron jobs ===');
  const res1 = await ssh.execCommand('crontab -l');
  console.log(res1.stdout || 'No cron jobs for root user');

  ssh.dispose();
}

main().catch(console.error);
