const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Renaming middleware.ts to middleware.ts.bak on Attack Server to resolve build conflict...');
    const renameRes = await ssh.execCommand('mv /var/www/escortvip/middleware.ts /var/www/escortvip/middleware.ts.bak || true');
    console.log(renameRes.stdout || renameRes.stderr || 'Success');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
