const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Attack (187.77.111.203)...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Connected!');

    console.log('Testing connection to Escort port 22 using Netcat...');
    const ncRes = await ssh.execCommand('nc -zv -w 5 213.232.235.181 22');
    console.log('nc output:', ncRes.stdout || ncRes.stderr);

    console.log('Testing direct SSH banner retrieve...');
    const bannerRes = await ssh.execCommand('curl -m 5 telnet://213.232.235.181:22');
    console.log('banner output:', bannerRes.stdout || bannerRes.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
