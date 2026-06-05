const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Viewing app/layout.tsx on Attack Server ---');
    const viewRes = await ssh.execCommand('sed -n "320,350p" /var/www/escortvip/app/layout.tsx');
    console.log(viewRes.stdout || 'Empty or error: ' + viewRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
