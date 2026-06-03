const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  console.log('=== Checking cron/crontab status and jobs ===');
  const res1 = await ssh.execCommand('crontab -l 2>&1');
  console.log('Crontab -l:', res1.stdout || 'None');
  
  console.log('\n=== Checking /etc/crontab ===');
  const res2 = await ssh.execCommand('cat /etc/crontab');
  console.log(res2.stdout);
  
  console.log('\n=== Checking files in /etc/cron.d /etc/cron.daily /etc/cron.hourly ===');
  const res3 = await ssh.execCommand('ls -la /etc/cron.d /etc/cron.daily /etc/cron.hourly 2>/dev/null');
  console.log(res3.stdout);
  
  ssh.dispose();
}

main().catch(console.error);
