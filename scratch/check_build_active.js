const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Checking current processes to see if Next.js build is active...');
    const psRes = await ssh.execCommand('ps aux | grep -i build');
    console.log(psRes.stdout || 'No build process running.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
