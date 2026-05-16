const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  const r = await ssh.execCommand('cat /etc/nginx/sites-available/sovereign-hydra.conf');
  console.log(r.stdout);
  ssh.dispose();
}
run();
