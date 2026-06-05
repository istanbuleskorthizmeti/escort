const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('--- Testing sitemap.xml on localhost:3000 ---');
    const res3000 = await ssh.execCommand('curl -i -s http://localhost:3000/sitemap.xml');
    console.log(res3000.stdout || res3000.stderr);

    console.log('\n--- Testing sitemap.xml on Port 80 (Nginx) ---');
    const res80 = await ssh.execCommand('curl -i -s -H "Host: istanbulescdrkcn.com" http://localhost/sitemap.xml');
    console.log(res80.stdout || res80.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
