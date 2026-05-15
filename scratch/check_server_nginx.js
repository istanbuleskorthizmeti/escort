const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkNginx() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('--- /etc/nginx/sites-enabled/escortvip ---');
    const result = await ssh.execCommand('cat /etc/nginx/sites-enabled/escortvip');
    console.log(result.stdout || result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

checkNginx();
