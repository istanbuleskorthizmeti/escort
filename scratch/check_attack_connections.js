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

    console.log('Checking connections to 213.232.235.181 from Attack...');
    const res = await ssh.execCommand('ss -atn | grep 213.232.235.181');
    console.log('ss output:\n', res.stdout || 'None');

    const res2 = await ssh.execCommand('netstat -antp | grep 213.232.235.181');
    console.log('netstat output:\n', res2.stdout || 'None');
  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
