const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading build.log ---');
    const logRes = await ssh.execCommand('tail -n 50 /var/www/escortvip/build.log 2>/dev/null || echo "No build.log file yet."');
    console.log(logRes.stdout || logRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
