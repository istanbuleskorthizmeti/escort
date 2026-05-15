const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkStatus() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('--- REMOTE STATUS ---');
    const pm2 = await ssh.execCommand('pm2 list');
    console.log(pm2.stdout);

    const nginx = await ssh.execCommand('systemctl status nginx | grep Active');
    console.log(nginx.stdout);

    const ports = await ssh.execCommand('netstat -tuln | grep :3001');
    console.log(ports.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

checkStatus();
