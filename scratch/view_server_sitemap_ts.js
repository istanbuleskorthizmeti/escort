const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Viewing app/sitemap.ts on Server ---');
    const viewRes = await ssh.execCommand('cat /var/www/escortvip/app/sitemap.ts');
    console.log(viewRes.stdout || 'Empty or error: ' + viewRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
