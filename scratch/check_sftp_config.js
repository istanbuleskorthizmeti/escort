const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking SSH configuration for SFTP ===');
  const res1 = await ssh.execCommand('grep -i "Subsystem sftp" /etc/ssh/sshd_config');
  console.log(res1.stdout || 'None');

  console.log('=== Testing sftp-server binary path ===');
  const res2 = await ssh.execCommand('ls -l /usr/lib/openssh/sftp-server /usr/libexec/openssh/sftp-server 2>/dev/null');
  console.log(res2.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
