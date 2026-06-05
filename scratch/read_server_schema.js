const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading server prisma/schema.prisma BotAccount ---');
    const catRes = await ssh.execCommand('grep -A 15 "model BotAccount" /var/www/escortvip/prisma/schema.prisma || echo "Not found"');
    console.log(catRes.stdout || catRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
