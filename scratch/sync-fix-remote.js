const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function syncFix() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('Uploading fixed server.js...');
    await ssh.putFile('server.js', '/root/esc/server.js');

    console.log('Restarting PM2...');
    await ssh.execCommand('pm2 restart all');
    
    console.log('✅ Remote server fixed and synced.');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

syncFix();
