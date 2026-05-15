const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function syncServerJs() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');
    await ssh.putFile('server.js', '/var/www/esc/server.js');
    console.log('✅ server.js synced to /var/www/esc.');

    await ssh.execCommand('pm2 restart hydra-web');
    console.log('🔄 Restarted hydra-web.');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

syncServerJs();
