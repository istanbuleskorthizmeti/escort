const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkServer() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('\n--- Checking for files with spaces ---');
    const result = await ssh.execCommand('ls "/var/www/cdn/vitrin/seo_12_WhatsApp Image 2026-04-26 at 15.40.19 (1).webp"');
    console.log(result.stdout || result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

checkServer();
