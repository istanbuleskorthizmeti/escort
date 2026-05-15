const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function deepFix() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('🔗 Connected.');

    console.log('🌐 [NGINX] Restarting...');
    const restartNginx = await ssh.execCommand('systemctl restart nginx');
    console.log(restartNginx.stdout || 'Nginx restarted.');
    
    const statusNginx = await ssh.execCommand('systemctl status nginx | grep Active');
    console.log('Nginx Status:', statusNginx.stdout);

    console.log('📊 [PM2] Current list:');
    const listBefore = await ssh.execCommand('pm2 list');
    console.log(listBefore.stdout);

    console.log('🚀 [PM2] Starting app from ecosystem...');
    const startApp = await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });
    console.log(startApp.stdout);

    console.log('📈 [PM2] Final list:');
    const listAfter = await ssh.execCommand('pm2 list');
    console.log(listAfter.stdout);

    console.log('✅ Remote server deep fix complete.');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

deepFix();
