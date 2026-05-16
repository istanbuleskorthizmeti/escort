const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function renameOnServer() {
  await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!'});
  
  console.log('🔄 Renaming files on server...');
  
  const cmd = `
    cd /var/www/cdn/vitrin/
    for f in istanbul-escort-dorukcanay\\ (*).webp; do
      num=$(echo "$f" | grep -oP '\\d+')
      mv "$f" "vip-profil-$num.webp"
    done
  `;
  
  const r = await ssh.execCommand(cmd, { shell: '/bin/bash' });
  console.log(r.stdout || r.stderr);
  
  const check = await ssh.execCommand('ls /var/www/cdn/vitrin/vip-profil-1.webp');
  console.log('Verification:', check.stdout || 'FAIL');
  
  ssh.dispose();
}

renameOnServer();
