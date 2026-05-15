const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkStaticFiles() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('📂 Listing .next/static/css:');
    const cssList = await ssh.execCommand('ls -R .next/static/css', { cwd: '/root/esc' });
    console.log(cssList.stdout || 'No CSS files found in .next/static/css');

    console.log('📄 Checking globals.css on remote:');
    const remoteCss = await ssh.execCommand('cat app/globals.css', { cwd: '/root/esc' });
    console.log(remoteCss.stdout.slice(0, 500) + '...');

    console.log('🔧 Checking Nginx configuration for static path:');
    const nginx = await ssh.execCommand('cat /etc/nginx/sites-enabled/hydra');
    console.log(nginx.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

checkStaticFiles();
