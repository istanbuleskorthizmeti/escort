const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const ssh = new NodeSSH();

async function deployNginx() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('Reading local nginx_escortvip...');
    const localConfig = fs.readFileSync(path.join(process.cwd(), 'nginx_escortvip'), 'utf8');
    const base64Config = Buffer.from(localConfig).toString('base64');

    console.log('Uploading Nginx config to server...');
    // We upload to a temp file first then move it to sites-enabled
    await ssh.execCommand(`echo "${base64Config}" | base64 -d > /tmp/escortvip_nginx`);
    await ssh.execCommand('mv /tmp/escortvip_nginx /etc/nginx/sites-enabled/escortvip');

    console.log('Testing Nginx configuration...');
    const testResult = await ssh.execCommand('nginx -t');
    console.log(testResult.stdout || testResult.stderr);

    if (testResult.code === 0) {
      console.log('Reloading Nginx...');
      await ssh.execCommand('nginx -s reload');
      console.log('✅ [DONE] Nginx reloaded successfully.');
    } else {
      console.error('❌ [ERROR] Nginx test failed. Rollback may be needed.');
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

deployNginx();
