const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkPaths() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('Checking /root/esc/public/assets/img ...');
    const result = await ssh.execCommand('ls -la /root/esc/public/assets/img | head -n 5');
    console.log(result.stdout || result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

checkPaths();
