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
    console.log('--- .env content (filtered for credentials) ---');
    const res = await ssh.execCommand('cat /var/www/escortvip/.env');
    const lines = res.stdout.split('\n');
    for (const line of lines) {
      if (line.includes('DATABASE_URL') || line.includes('DB_') || line.includes('POSTGRES')) {
        console.log(line);
      } else {
        // Redact other sensitive keys if any but print keys
        const parts = line.split('=');
        if (parts[0]) {
          console.log(`${parts[0]}=[REDACTED]`);
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
