const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking connection to 213.232.235.181:5432 ---');
    const ncRes = await ssh.execCommand('nc -z -v -w5 213.232.235.181 5432');
    console.log(ncRes.stdout || ncRes.stderr || 'No response.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
