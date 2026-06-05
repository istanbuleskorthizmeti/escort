const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Checking build.log status ---');
    const logStat = await ssh.execCommand('ls -l /var/www/escortvip/build.log');
    console.log(logStat.stdout || logStat.stderr);
    
    console.log('--- Last 20 lines of build.log ---');
    const logRes = await ssh.execCommand('tail -n 20 /var/www/escortvip/build.log');
    console.log(logRes.stdout || logRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
