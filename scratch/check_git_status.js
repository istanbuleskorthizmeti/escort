const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- git status on Attack Server ---');
    const statusRes = await ssh.execCommand('cd /var/www/escortvip && git status');
    console.log(statusRes.stdout || statusRes.stderr);

    console.log('--- git diff on Attack Server ---');
    const diffRes = await ssh.execCommand('cd /var/www/escortvip && git diff app/layout.tsx');
    console.log(diffRes.stdout || 'No diff for layout.tsx');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
