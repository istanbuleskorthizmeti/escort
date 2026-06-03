const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Final audit: active connections (ss -ntup) ===');
  const res1 = await ssh.execCommand('ss -ntup');
  console.log(res1.stdout || 'None');

  console.log('=== Final audit: PM2 process list ===');
  const res2 = await ssh.execCommand('pm2 list');
  console.log(res2.stdout);

  console.log('=== Final audit: server CPU usage ===');
  const res3 = await ssh.execCommand('uptime && ps -eo %cpu,%mem,cmd --sort=-%cpu | head -n 10');
  console.log(res3.stdout);

  ssh.dispose();
}

main().catch(console.error);
