const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Grepping ALL Nginx access logs for tg or webhook ===');
  const res1 = await ssh.execCommand('grep -r -i "webhook" /var/log/nginx/ 2>/dev/null | tail -n 50');
  console.log(res1.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
