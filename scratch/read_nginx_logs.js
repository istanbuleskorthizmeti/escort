const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function readLogs() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('--- Nginx Error Log ---');
    const result = await ssh.execCommand('tail -n 50 /var/log/nginx/error.log');
    console.log(result.stdout || result.stderr);

    console.log('\n--- Nginx Access Log (filtering for .webp) ---');
    const accessResult = await ssh.execCommand('tail -n 100 /var/log/nginx/access.log | grep ".webp"');
    console.log(accessResult.stdout || accessResult.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

readLogs();
