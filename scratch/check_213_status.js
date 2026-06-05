const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to 213.232.235.181');

    console.log('\n=== NGINX STATUS ===');
    const nginx = await ssh.execCommand('systemctl status nginx --no-pager');
    console.log(nginx.stdout || nginx.stderr);

    console.log('\n=== PM2 STATUS ===');
    const pm2 = await ssh.execCommand('pm2 list');
    console.log(pm2.stdout || pm2.stderr);

    console.log('\n=== LISTENING PORTS ===');
    const ssOut = await ssh.execCommand('ss -tulpn');
    console.log(ssOut.stdout || ssOut.stderr);

  } catch (e) {
    console.error('❌ Failed to connect or query 213.232.235.181:', e.message);
  } finally {
    ssh.dispose();
  }
}
run();
