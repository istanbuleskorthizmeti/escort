const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Checking for proxy.* in server root ---');
    const lsRes = await ssh.execCommand('ls -la /var/www/escortvip/proxy.*');
    console.log(lsRes.stdout || lsRes.stderr || 'No proxy.* files found.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
