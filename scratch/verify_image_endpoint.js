const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected to server.');

    // Curl the Next.js optimized image endpoint for a relative image path
    const checkUrl = 'http://localhost/_next/image?url=%2F_media%2Fvitrin%2Fvip-profil-116.webp&w=256&q=75';
    console.log(`Checking URL: ${checkUrl}`);
    
    const check = await ssh.execCommand(`curl -I -H "Host: istanbulescort.blog" "${checkUrl}"`);
    console.log('Response Headers:\n', check.stdout || check.stderr);

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
})();
