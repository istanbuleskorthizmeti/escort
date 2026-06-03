const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking memory swap usage ===');
  const res1 = await ssh.execCommand('swapon -s || cat /proc/swaps');
  console.log(res1.stdout);

  console.log('=== Checking systemd journal error alerts ===');
  const res2 = await ssh.execCommand('journalctl -p 3 -n 50 --no-pager');
  console.log(res2.stdout);

  ssh.dispose();
}

main().catch(console.error);
