const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Full build.log ---');
    const logRes = await ssh.execCommand('cat /var/www/escortvip/build.log');
    console.log(logRes.stdout || logRes.stderr || 'build.log is empty.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
