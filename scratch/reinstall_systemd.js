const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking packages providing systemd-logind ===');
  const res1 = await ssh.execCommand('find /lib/systemd/ -name "systemd-logind"');
  console.log(res1.stdout || 'None');

  console.log('=== Reinstalling systemd package to recover binary ===');
  const res2 = await ssh.execCommand('apt-get update && apt-get install --reinstall -y systemd');
  console.log(res2.stdout || res2.stderr);

  console.log('=== Restarting systemd-logind ===');
  const res3 = await ssh.execCommand('systemctl restart systemd-logind && systemctl status systemd-logind');
  console.log(res3.stdout || res3.stderr);

  ssh.dispose();
}

main().catch(console.error);
