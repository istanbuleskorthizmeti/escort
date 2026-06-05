const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('--- DATABASE_URL from .env ---');
    const res = await ssh.execCommand('grep "DATABASE_URL" /var/www/escortvip/.env');
    const url = res.stdout.trim();
    // Redact password
    // postgresql://username:password@host:port/database
    const parsed = url.replace(/:([^:@]+)@/, ':REDACTED@');
    console.log(parsed);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
