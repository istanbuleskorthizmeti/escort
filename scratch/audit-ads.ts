import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';

async function auditAds() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Auditing AdProfile data and schema...');
    
    // 1. Peek at AdProfile data in SQL
    const sqlPeek = await ssh.execCommand('grep -A 10 "COPY public.\\"AdProfile\\"" /var/www/escortvip/vuc2026.sql');
    console.log('--- SQL AdProfile DATA ---');
    console.log(sqlPeek.stdout);

    // 2. Check AdProfile columns in DB
    const dbCols = await ssh.execCommand(`psql "${dbUrl}" -c "\\d \\"AdProfile\\""`);
    console.log('\n--- DB AdProfile COLUMNS ---');
    console.log(dbCols.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

auditAds();
