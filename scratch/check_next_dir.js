const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking .next build artifacts ---');
    const checkRes = await ssh.execCommand('ls -lh /var/www/escortvip/.next && cat /var/www/escortvip/.next/BUILD_ID || echo "No BUILD_ID found"');
    console.log(checkRes.stdout || checkRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
