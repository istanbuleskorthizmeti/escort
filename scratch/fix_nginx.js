const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
  try {
    console.log('Connecting via Jump Host 45.93.137.164...');
    const jumpSsh = new NodeSSH();
    await jumpSsh.connect({
      host: '45.93.137.164',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected to Jump. Connecting to Main 213.232.235.181...');
    // We can't easily use JumpHost in node-ssh with password, so we'll run remote commands via jump
    
    const cmd = "sshpass -p '4TVuj7qiHMfh7CxH6K!' ssh -o StrictHostKeyChecking=no root@213.232.235.181 \"sed -i 's/localhost:3005/127.0.0.1:3005/g' /etc/nginx/sites-enabled/escortvip && systemctl restart nginx\"";
    const res = await jumpSsh.execCommand(cmd);
    console.log(res.stdout || res.stderr);

    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

fix();
