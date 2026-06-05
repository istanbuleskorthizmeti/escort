const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- dig mx dorukcanay.digital ---');
    const mxRes = await ssh.execCommand('dig mx dorukcanay.digital +short');
    console.log(mxRes.stdout || 'No MX records returned.');

    console.log('--- dig any dorukcanay.digital ---');
    const anyRes = await ssh.execCommand('dig any dorukcanay.digital +short');
    console.log(anyRes.stdout || 'No ANY records returned.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
