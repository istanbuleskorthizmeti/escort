const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  const r = await ssh.execCommand('grep -R -i "css" /etc/nginx');
  console.log(r.stdout);
  
  const r2 = await ssh.execCommand('grep -R -i "_next" /etc/nginx');
  console.log(r2.stdout);
  
  const r3 = await ssh.execCommand('cat /etc/nginx/sites-available/hydra | head -n 40');
  console.log(r3.stdout);
  process.exit(0);
}
run();
