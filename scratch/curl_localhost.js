const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking active ports via netstat ---');
    const netRes = await ssh.execCommand('netstat -lntp | grep -E "3000|nginx"');
    console.log(netRes.stdout || 'Nothing found.');

    console.log('--- curlling localhost:3000 ---');
    const curlRes = await ssh.execCommand('curl -I http://localhost:3000');
    console.log(curlRes.stdout || curlRes.stderr || 'No curl output.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
