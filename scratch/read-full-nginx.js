const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function readFullNginx() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('--- FULL NGINX CONFIG ---');
    const result = await ssh.execCommand('cat /etc/nginx/sites-enabled/hydra');
    console.log(result.stdout);

    console.log('--- PUBLIC DIR LIST ---');
    const pub = await ssh.execCommand('ls -R public', { cwd: '/var/www/esc' });
    console.log(pub.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

readFullNginx();
