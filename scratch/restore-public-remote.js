const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function uploadAndExtract() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('🚀 Uploading public.tar.gz...');
    await ssh.putFile('public.tar.gz', '/root/esc/public.tar.gz');
    console.log('✅ Uploaded.');

    console.log('📦 Extracting public.tar.gz to /var/www/esc...');
    // -C /var/www/esc extracts to that directory
    // --strip-components=1 if you want to extract contents of "public" directly into /var/www/esc/public
    // But since the tar has "public" as root, extracting to /var/www/esc will create /var/www/esc/public
    await ssh.execCommand('tar -xzf /root/esc/public.tar.gz -C /var/www/esc/');
    
    console.log('🔄 Cleaning up...');
    await ssh.execCommand('rm /root/esc/public.tar.gz');

    console.log('🌐 Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('✅ Public assets restored. Site should be beautiful again.');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

uploadAndExtract();
