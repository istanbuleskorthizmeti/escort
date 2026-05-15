const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function extremeFix() {
  try {
    console.log('🔗 [EXTREME FIX] Attempting connection to 213.232.235.181 with 5m timeout...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!',
      readyTimeout: 300000 // 5 minutes
    });
    
    console.log('✅ Connected.');

    console.log('💀 Killing all processes on port 3000/3001...');
    await ssh.execCommand('fuser -k 3000/tcp');
    await ssh.execCommand('fuser -k 3001/tcp');
    await ssh.execCommand('pm2 kill');

    console.log('🚀 Starting fresh...');
    await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });

    console.log('🌐 Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('✅ Fix complete.');

  } catch(e) {
    console.error('❌ Failed:', e.message);
  } finally {
    ssh.dispose();
  }
}

extremeFix();
