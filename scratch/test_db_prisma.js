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
    console.log('--- Testing DB connection via Prisma with env: vuc2026 ---');
    const db1Res = await ssh.execCommand('cd /var/www/escortvip && DATABASE_URL="postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable" npx prisma db push --preview-feature --dry-run || npx prisma db pull --print');
    console.log(db1Res.stdout || db1Res.stderr);

    console.log('\n--- Testing DB connection via Prisma with env: escortvip_db ---');
    const db2Res = await ssh.execCommand('cd /var/www/escortvip && DATABASE_URL="postgresql://sovereign:SovereignGodMode2026!@127.0.0.1:5432/escortvip_db?schema=public" npx prisma db push --preview-feature --dry-run || npx prisma db pull --print');
    console.log(db2Res.stdout || db2Res.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
