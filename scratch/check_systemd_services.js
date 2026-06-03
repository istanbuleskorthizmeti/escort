const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking dbus and systemd-logind status ===');
  const res1 = await ssh.execCommand('systemctl status dbus systemd-logind');
  console.log(res1.stdout);

  ssh.dispose();
}

main().catch(console.error);
