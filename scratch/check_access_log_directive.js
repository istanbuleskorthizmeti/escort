const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking access_log setting in sovereign-hydra.conf ===');
  const res = await ssh.execCommand('grep -i "access_log" /etc/nginx/sites-enabled/sovereign-hydra.conf');
  console.log(res.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
