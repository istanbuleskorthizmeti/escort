const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

ssh.connect({
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
}).then(async () => {
  console.log('Connected.');
  
  // 1. Delete /etc/nginx/sites-enabled/escortvip entirely to remove redundancy/conflicts
  const delRes = await ssh.execCommand('rm -f /etc/nginx/sites-enabled/escortvip');
  console.log('Deleted legacy escortvip file:', delRes.code === 0 ? 'SUCCESS' : 'FAILED');

  // 2. Read local nginx_escortvip configuration
  const fs = require('fs');
  const path = require('path');
  const localConfig = fs.readFileSync(path.join(process.cwd(), 'nginx_escortvip'), 'utf8');
  const base64Config = Buffer.from(localConfig).toString('base64');

  // 3. Deploy it directly to sovereign-hydra.conf (sites-available)
  console.log('Writing configuration to sites-available/sovereign-hydra.conf...');
  await ssh.execCommand(`echo "${base64Config}" | base64 -d > /tmp/sovereign-hydra.conf`);
  await ssh.execCommand('mv /tmp/sovereign-hydra.conf /etc/nginx/sites-available/sovereign-hydra.conf');

  // 4. Test and restart Nginx
  console.log('Testing and reloading Nginx...');
  const testRes = await ssh.execCommand('nginx -t');
  console.log('Nginx test output:\n', testRes.stdout || testRes.stderr);
  
  if (testRes.code === 0) {
    const reloadRes = await ssh.execCommand('systemctl reload nginx');
    console.log('Reloaded Nginx successfully:', reloadRes.code === 0 ? 'YES' : 'NO');
  } else {
    console.error('Nginx test failed!');
  }

  ssh.dispose();
}).catch(console.error);
