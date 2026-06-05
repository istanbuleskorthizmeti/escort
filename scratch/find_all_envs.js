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
    console.log('--- Finding env files ---');
    const findRes = await ssh.execCommand('find /var/www/escortvip -maxdepth 1 -name ".env*"');
    console.log(findRes.stdout || findRes.stderr);

    const files = findRes.stdout.trim().split('\n').filter(Boolean);
    for (const file of files) {
      console.log(`\n--- DATABASE_URL in ${file} ---`);
      const grepRes = await ssh.execCommand(`grep "DATABASE_URL" ${file}`);
      const url = grepRes.stdout.trim();
      const parsed = url.replace(/:([^:@]+)@/, ':REDACTED@');
      console.log(parsed);
    }
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
