const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkServer() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('Counting .webp files in /var/www/cdn/vitrin/ ...');
    const result = await ssh.execCommand('ls /var/www/cdn/vitrin/*.webp | wc -l');
    console.log('Count:', result.stdout.trim());

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

checkServer();
