const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking network connections (ss -ntup) ===');
  const res1 = await ssh.execCommand('ss -ntup');
  console.log(res1.stdout);

  console.log('=== Checking running processes (ps aux) ===');
  const res2 = await ssh.execCommand('ps aux | grep -v "\\[" | head -n 100');
  console.log(res2.stdout);

  ssh.dispose();
}

main().catch(console.error);
