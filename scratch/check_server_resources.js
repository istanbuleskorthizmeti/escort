const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking memory and storage status ===');
  const res1 = await ssh.execCommand('free -m');
  console.log(res1.stdout);

  const res2 = await ssh.execCommand('df -h');
  console.log(res2.stdout);

  const res3 = await ssh.execCommand('dmesg -T | grep -i "out of memory" | tail -n 20');
  console.log(res3.stdout || 'No Out-Of-Memory logs in dmesg');

  ssh.dispose();
}

main().catch(console.error);
