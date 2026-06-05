const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- remote .env DATABASE_URL ---');
    const envRes = await ssh.execCommand('grep -i "DATABASE_URL" /var/www/escortvip/.env');
    console.log(envRes.stdout || envRes.stderr || 'No DATABASE_URL found in .env.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
