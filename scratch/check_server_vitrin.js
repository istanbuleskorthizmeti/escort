const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkServer() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('--- /var/www/cdn/vitrin/ ---');
    const result = await ssh.execCommand('ls -la /var/www/cdn/vitrin/ | head -n 20');
    console.log(result.stdout);

    console.log('\n--- Checking for .webp files ---');
    const webpResult = await ssh.execCommand('ls /var/www/cdn/vitrin/*.webp | head -n 5');
    console.log(webpResult.stdout || 'No .webp files found');

    console.log('\n--- Checking for .jpg files ---');
    const jpgResult = await ssh.execCommand('ls /var/www/cdn/vitrin/*.jpg | head -n 5');
    console.log(jpgResult.stdout || 'No .jpg files found');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

checkServer();
