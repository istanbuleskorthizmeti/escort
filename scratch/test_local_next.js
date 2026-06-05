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
    console.log('--- Testing localhost:3000 connection ---');
    const curlRes = await ssh.execCommand('curl -I -s http://localhost:3000');
    console.log(curlRes.stdout || curlRes.stderr);

    console.log('\n--- Testing one of the domains via Cloudflare / Nginx routing ---');
    console.log('We will resolve local Nginx response for a sample domain from config:');
    const headerRes = await ssh.execCommand('curl -I -s -H "Host: vipescorthizmeti.com" http://localhost');
    console.log(headerRes.stdout || headerRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
