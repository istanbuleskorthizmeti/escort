const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixNginxAssets() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    const filePath = '/etc/nginx/sites-enabled/hydra';
    console.log(`Reading ${filePath}...`);
    const content = await ssh.execCommand(`cat ${filePath}`);
    let nginxConfig = content.stdout;

    // Fix alias paths from /root/esc to /var/www/esc
    const newConfig = nginxConfig.replace(/\/root\/esc\//g, '/var/www/esc/');
    
    if (nginxConfig !== newConfig) {
      console.log('Updating Nginx config paths...');
      await ssh.execCommand(`echo '${newConfig.replace(/'/g, "'\\''")}' > ${filePath}`);
      
      console.log('Verifying and reloading Nginx...');
      const verify = await ssh.execCommand('nginx -t');
      if (verify.stderr.includes('successful') || verify.stdout.includes('successful')) {
        await ssh.execCommand('systemctl restart nginx');
        console.log('Nginx restarted with corrected paths.');
      } else {
        console.error('Nginx test failed!', verify.stderr);
      }
    } else {
      console.log('Nginx paths already correct or not found.');
    }

    console.log('📂 Checking Vitrin images:');
    const imgs = await ssh.execCommand('ls -la /var/www/esc/public/cdn/vitrin/ | head -n 10');
    console.log(imgs.stdout || 'No images found in /var/www/esc/public/cdn/vitrin/');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

fixNginxAssets();
