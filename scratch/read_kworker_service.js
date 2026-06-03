const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Reading /etc/systemd/system/kworker.service ===');
  const res1 = await ssh.execCommand('cat /etc/systemd/system/kworker.service');
  console.log(res1.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
