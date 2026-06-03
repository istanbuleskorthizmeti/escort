const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking SSH connection parameters ===');
  const res1 = await ssh.execCommand('grep -i "MaxStartups" /etc/ssh/sshd_config');
  console.log(res1.stdout || 'None');

  const res2 = await ssh.execCommand('grep -i "ClientAlive" /etc/ssh/sshd_config');
  console.log(res2.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
