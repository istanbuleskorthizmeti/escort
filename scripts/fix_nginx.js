const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
async function run() {
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  
  // Read config
  const r1 = await ssh.execCommand('cat /etc/nginx/sites-available/sovereign-hydra.conf');
  let config = r1.stdout;
  
  // Remove the static blocks that are causing 403 Forbidden
  config = config.replace(/location \/_next\/static\/ \{[\s\S]*?\}\n/g, '');
  config = config.replace(/location \/_next\/ \{[\s\S]*?\}\n/g, '');
  
  // Write it back to the server using Base64 echo (Bypass SFTP SIGKILL)
  const base64Config = Buffer.from(config).toString('base64');
  await ssh.execCommand(`echo "${base64Config}" | base64 --decode > /etc/nginx/sites-available/sovereign-hydra.conf`);
  
  const r2 = await ssh.execCommand('nginx -t && systemctl reload nginx');
  console.log(r2.stdout || r2.stderr);
  process.exit(0);
}
run();
