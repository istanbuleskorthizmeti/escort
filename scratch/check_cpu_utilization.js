const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking memory and system load during idle ===');
  const res1 = await ssh.execCommand('free -m && uptime');
  console.log(res1.stdout);

  console.log('=== Checking for top CPU-consuming processes ===');
  const res2 = await ssh.execCommand('ps -eo %cpu,%mem,cmd --sort=-%cpu | head -n 20');
  console.log(res2.stdout);

  ssh.dispose();
}

main().catch(console.error);
