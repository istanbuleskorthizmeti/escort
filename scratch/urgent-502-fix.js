const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function urgentFix() {
  try {
    console.log('🔗 Connecting to 213.232.235.181 (Long Timeout)...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!',
      readyTimeout: 120000 // 2 minutes
    });
    
    console.log('✅ Connected.');

    console.log('🛑 [PM2] Killing everything to free resources...');
    await ssh.execCommand('pm2 delete all');
    await ssh.execCommand('pkill -9 next');
    await ssh.execCommand('pkill -9 npm');
    await ssh.execCommand('pkill -9 node');

    console.log('🚀 [PM2] Restarting from ecosystem...');
    await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/var/www/esc' });

    console.log('🌐 [NGINX] Restarting...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('✅ 502 Fixed.');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

urgentFix();
