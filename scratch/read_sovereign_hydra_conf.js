const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Reading /etc/nginx/sites-enabled/sovereign-hydra.conf ===');
  const res1 = await ssh.execCommand('cat /etc/nginx/sites-enabled/sovereign-hydra.conf');
  console.log(res1.stdout);

  ssh.dispose();
}

main().catch(console.error);
