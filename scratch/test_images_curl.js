const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function testImages() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('Testing /assets/img/ link...');
    const result1 = await ssh.execCommand('curl -I http://localhost:3001/assets/img/seo_0_pinterest_aesthetic_1.webp');
    console.log(result1.stdout || result1.stderr);

    console.log('\nTesting /_media/vitrin/ link...');
    const result2 = await ssh.execCommand('curl -I http://localhost/_media/vitrin/seo_0_pinterest_aesthetic_1.webp');
    console.log(result2.stdout || result2.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

testImages();
