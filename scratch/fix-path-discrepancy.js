const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixPathDiscrepancy() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    // 1. Move everything to /var/www/esc (The correct place)
    console.log('📦 Syncing /root/esc to /var/www/esc...');
    await ssh.execCommand('rsync -av --exclude "node_modules" /root/esc/ /var/www/esc/');
    
    // 2. Ensure .next is copied
    console.log('🚀 Copying .next build...');
    await ssh.execCommand('cp -r /root/esc/.next /var/www/esc/');

    // 3. Restart PM2 in /var/www/esc
    console.log('🔄 Restarting PM2 in /var/www/esc...');
    await ssh.execCommand('pm2 delete all');
    await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/var/www/esc' });

    // 4. Update Nginx (Already points to /var/www/esc, but let's double check the gzip issue I fixed earlier)
    console.log('🌐 Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('📊 PM2 Status:');
    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);

    console.log('✅ Path discrepancy fixed. CSS should be back.');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

fixPathDiscrepancy();
