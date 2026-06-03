const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Reading /root/esc/app/api/test-db-route/route.ts ===');
  const res = await ssh.execCommand('cat /root/esc/app/api/test-db-route/route.ts');
  console.log(res.stdout);

  ssh.dispose();
}

main().catch(console.error);
