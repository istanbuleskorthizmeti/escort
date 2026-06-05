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

    // Check if the rewritten SEO URL serves the actual image from next/image
    // /istanbul-vip-escort-ilan-116.webp should rewrite to /_media/vitrin/vip-profil-116.webp
    // Let's test calling the URL directly and through the Next.js image optimizer URL
    const checkUrls = [
      'http://localhost/istanbul-vip-escort-ilan-116.webp',
      'http://localhost/_next/image?url=%2Fistanbul-vip-escort-ilan-116.webp&w=256&q=75'
    ];

    for (const url of checkUrls) {
      console.log(`Checking URL: ${url}`);
      const check = await ssh.execCommand(`curl -I -H "Host: istanbulescort.blog" "${url}"`);
      console.log('Response Headers:\n', check.stdout || check.stderr);
      console.log('-------------------------------------------');
    }

    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
})();
