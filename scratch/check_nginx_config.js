const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Listing Nginx logs ===');
  const res1 = await ssh.execCommand('ls -lh /var/log/nginx/');
  console.log(res1.stdout);

  console.log('=== Checking Nginx Config Files ===');
  const res2 = await ssh.execCommand('ls -lh /etc/nginx/sites-enabled/');
  console.log(res2.stdout);

  const res3 = await ssh.execCommand('cat /etc/nginx/sites-enabled/* | grep -i "proxy_pass" -B 2 -A 2');
  console.log(res3.stdout);

  ssh.dispose();
}

main().catch(console.error);
