const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  const res = await ssh.execCommand('curl -s http://localhost:3001');
  const match = res.stdout.match(/_next\/static\/css\/[a-z0-9]+\.css/g);
  console.log('HTML REQUESTS CSS:', match ? match : 'NOT FOUND');
  const ls = await ssh.execCommand('ls -la /root/esc/.next/static/css');
  console.log('CSS ON SERVER:', ls.stdout);
  process.exit(0);
}
run();
