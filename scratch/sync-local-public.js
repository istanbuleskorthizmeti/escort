const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path');

async function syncPublicLocal() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    const localPublic = path.join(__dirname, '../public');
    const remotePublic = '/var/www/esc/public';

    console.log(`🚀 Syncing local ${localPublic} to remote ${remotePublic}...`);
    
    // node-ssh putDirectory is very efficient
    await ssh.putDirectory(localPublic, remotePublic, {
      recursive: true,
      concurrency: 10,
      validate: (itemPath) => {
        const basename = path.basename(itemPath);
        return !basename.startsWith('.');
      }
    });

    console.log('✅ Local public assets synced to production.');

    // Also sync to /root/esc/public just in case
    await ssh.execCommand('rsync -av /var/www/esc/public/ /root/esc/public/');

    console.log('🔄 Restarting Nginx to be sure...');
    await ssh.execCommand('systemctl restart nginx');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

syncPublicLocal();
