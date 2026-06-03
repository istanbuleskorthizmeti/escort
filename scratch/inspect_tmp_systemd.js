const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Listing files in /tmp ===');
  const res1 = await ssh.execCommand('ls -la /tmp/');
  console.log(res1.stdout);

  console.log('=== Checking for suspect systemd unit files ===');
  const res2 = await ssh.execCommand('ls -la /etc/systemd/system/ | grep -v "symlink" | head -n 100');
  console.log(res2.stdout);

  ssh.dispose();
}

main().catch(console.error);
