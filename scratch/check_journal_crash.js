const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking journal for session 3748784 (the scp session) ===');
  const res = await ssh.execCommand('journalctl _PID=3748784 --no-pager');
  console.log(res.stdout || 'No log details for that PID');

  console.log('=== Checking general auth messages around 18:30:35 ===');
  const res2 = await ssh.execCommand('journalctl --since "18:30:30" --until "18:30:40" --no-pager');
  console.log(res2.stdout);

  ssh.dispose();
}

main().catch(console.error);
