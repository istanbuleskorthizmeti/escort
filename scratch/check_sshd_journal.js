const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking sshd system logs for connection termination ===');
  const res = await ssh.execCommand('journalctl -u ssh -n 20 --no-pager');
  console.log(res.stdout);

  ssh.dispose();
}

main().catch(console.error);
