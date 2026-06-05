const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- pg_isready ---');
    const readyRes = await ssh.execCommand('pg_isready');
    console.log(readyRes.stdout || readyRes.stderr);

    console.log('--- pg database list ---');
    const listRes = await ssh.execCommand('psql -U postgres -l || psql -l');
    console.log(listRes.stdout || listRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
