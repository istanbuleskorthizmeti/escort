const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkNginx() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    const result = await ssh.execCommand('cat /etc/nginx/sites-enabled/escortvip');
    console.log(result.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

checkNginx();
