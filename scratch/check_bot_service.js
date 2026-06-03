const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking bot.service status and configuration ===');
  const res1 = await ssh.execCommand('systemctl status bot.service || true');
  console.log(res1.stdout);

  const res2 = await ssh.execCommand('cat /etc/systemd/system/bot.service || true');
  console.log(res2.stdout);

  ssh.dispose();
}

main().catch(console.error);
