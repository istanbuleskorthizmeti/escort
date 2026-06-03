const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking /usr/lib/systemd/systemd-logind path and attributes ===');
  const res1 = await ssh.execCommand('ls -l /usr/lib/systemd/systemd-logind');
  console.log(res1.stdout || res1.stderr);

  const res2 = await ssh.execCommand('lsattr /usr/lib/systemd/systemd-logind');
  console.log(res2.stdout || res2.stderr);

  ssh.dispose();
}

main().catch(console.error);
