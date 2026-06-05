const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- checking if postgresql is running locally on Attack Server ---');
    const pgRes = await ssh.execCommand('systemctl status postgresql || pg_isready || netstat -lntp | grep :5432');
    console.log(pgRes.stdout || pgRes.stderr || 'PostgreSQL not found locally.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
