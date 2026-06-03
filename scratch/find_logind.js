const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Locating systemd-logind or related system tools ===');
  const res1 = await ssh.execCommand('find /usr/ -name "*logind*"');
  console.log(res1.stdout || 'None');

  const res2 = await ssh.execCommand('dpkg -l | grep systemd');
  console.log(res2.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
