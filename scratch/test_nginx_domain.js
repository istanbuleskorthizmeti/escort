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
    console.log('--- Testing Host: istanbulescort.blog on Nginx (Port 80) ---');
    const curlRes = await ssh.execCommand('curl -I -s -H "Host: istanbulescort.blog" http://localhost');
    console.log(curlRes.stdout || curlRes.stderr);

    console.log('\n--- Testing Host: www.istanbulescort.blog on Nginx (Port 80) ---');
    const curlResWww = await ssh.execCommand('curl -I -s -H "Host: www.istanbulescort.blog" http://localhost');
    console.log(curlResWww.stdout || curlResWww.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
