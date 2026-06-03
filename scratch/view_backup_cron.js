const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Reading /etc/cron.d/hydra-secure-backup ===');
  const res = await ssh.execCommand('cat /etc/cron.d/hydra-secure-backup');
  console.log(res.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
