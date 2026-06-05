const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('PID check for NextJS old builds...');
    // Kill the high-CPU Node process (257269) which is the legacy build/runner loop
    await ssh.execCommand('kill -9 257269 || true');
    console.log('Killed PID 257269');

    // Clean up cache and trigger dynamic builds again without conflicts
    console.log('Cleaning .next folder...');
    await ssh.execCommand('rm -rf /var/www/escortvip/.next');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
