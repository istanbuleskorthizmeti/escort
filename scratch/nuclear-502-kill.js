const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function nuclearFix() {
  try {
    console.log('🚀 [NUCLEAR FIX] Connecting to Alexhost (213.232.235.181)...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!',
      readyTimeout: 60000
    });
    
    console.log('✅ Connected.');

    // 1. Kill everything
    console.log('💀 Killing all node/pm2 processes...');
    await ssh.execCommand('pm2 kill');
    await ssh.execCommand('pkill -9 node');
    await ssh.execCommand('pkill -9 npm');

    // 2. Clean build directory
    console.log('🧹 Cleaning build artifacts...');
    await ssh.execCommand('rm -rf /root/esc/.next');
    await ssh.execCommand('rm -rf /var/www/esc/.next');

    // 3. Ensure we are in the right directory
    console.log('📂 Verifying directory /root/esc...');
    const ls = await ssh.execCommand('ls -la', { cwd: '/root/esc' });
    console.log(ls.stdout);

    // 4. Force Start (Bypassing build for a second to see if it even runs)
    console.log('🚀 Attempting Force Start...');
    // We try to start the app. If it's already built, it will run.
    await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });

    // 5. Nginx Refresh
    console.log('🌐 Refreshing Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('✅ [NUCLEAR FIX] Done. Check the site now.');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

nuclearFix();
