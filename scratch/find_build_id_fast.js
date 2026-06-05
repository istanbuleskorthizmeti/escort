const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Fast searching for BUILD_ID ---');
    const findRes = await ssh.execCommand('find /var/www/escortvip -path "*/node_modules" -prune -o -name "BUILD_ID" -print');
    console.log(findRes.stdout || 'No BUILD_ID found.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
