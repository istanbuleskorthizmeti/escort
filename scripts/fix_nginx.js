const { NodeSSH } = require('node-ssh');
const path = require('path');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Server...');
    await ssh.connect({host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!', readyTimeout: 20000});
    
    console.log('Generating Self-Signed SSL Cert...');
    await ssh.execCommand('openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout /etc/ssl/private/drkcnay-selfsigned.key -out /etc/ssl/certs/drkcnay-selfsigned.crt -subj "/C=TR/ST=Istanbul/L=Istanbul/O=Hydra/OU=IT/CN=vipescorthizmeti.com"');
    
    console.log('Uploading Nginx Config...');
    await ssh.putFile(path.join(process.cwd(), 'nginx_escortvip'), '/etc/nginx/sites-available/sovereign-hydra.conf');
    
    console.log('Configuring Nginx Symlinks...');
    await ssh.execCommand('rm -f /etc/nginx/sites-enabled/hydra');
    await ssh.execCommand('rm -f /etc/nginx/sites-enabled/default');
    await ssh.execCommand('ln -s /etc/nginx/sites-available/sovereign-hydra.conf /etc/nginx/sites-enabled/sovereign-hydra.conf');
    
    console.log('Testing Nginx...');
    const test = await ssh.execCommand('nginx -t');
    console.log(test.stdout);
    if (test.stderr) console.error(test.stderr);
    
    if (test.stderr && test.stderr.includes('successful')) {
      console.log('Restarting Nginx...');
      await ssh.execCommand('systemctl restart nginx');
      console.log('Done! 521 Error should be gone.');
    } else {
      console.error('Nginx test failed, not restarting.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    ssh.dispose();
  }
}
run();
