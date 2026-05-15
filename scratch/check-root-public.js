const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkRootPublic() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('📂 Listing /root/esc/public:');
    const result = await ssh.execCommand('ls -la /root/esc/public');
    console.log(result.stdout || '/root/esc/public is empty or missing');

    if (result.stdout.includes('og-image.jpg')) {
        console.log('🚀 Syncing public folder to /var/www/esc...');
        await ssh.execCommand('rsync -av /root/esc/public/ /var/www/esc/public/');
        console.log('✅ Public assets synced.');
    } else {
        console.warn('⚠️ /root/esc/public is also missing assets. Need local sync.');
    }

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

checkRootPublic();
