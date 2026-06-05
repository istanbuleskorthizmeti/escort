const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Checking PostgreSQL status on Attack Server...');
    const pgRes = await ssh.execCommand('systemctl status postgresql');
    console.log('Postgres status:\n', pgRes.stdout || pgRes.stderr);

    console.log('\nChecking listening ports on 127.0.0.1...');
    const netstatRes = await ssh.execCommand('ss -tulpn | grep 5432');
    console.log('Netstat output:\n', netstatRes.stdout || 'Nothing on port 5432');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
