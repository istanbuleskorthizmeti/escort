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
    console.log('=== NSLOOKUP GLOBAL ===');
    const ns = await ssh.execCommand('nslookup istanbulescort.blog 8.8.8.8');
    console.log(ns.stdout || ns.stderr);

    console.log('=== CURL VIA DOMAIN (HTTPS) ===');
    const curl = await ssh.execCommand('curl -Iv https://istanbulescort.blog/');
    console.log(curl.stdout || curl.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
