import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const oldDbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';
const newPass = 'D0rukC4n4y_Elit3_Secur3_2026_!X';

async function restoreDatabase() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛡️ Hardening Database Security and Restoring Data...');
    
    // 1. Change Password in PostgreSQL
    await ssh.execCommand(`psql "${oldDbUrl}" -c "ALTER USER vuc2026_user WITH PASSWORD '${newPass}';"`);
    console.log('✅ Database password updated.');

    // 2. Update .env file
    const newDbUrl = `postgresql://vuc2026_user:${newPass}@localhost:5432/vuc2026?sslmode=disable`;
    await ssh.execCommand(`sed -i 's|DATABASE_URL=.*|DATABASE_URL="${newDbUrl}"|' /root/hydra/.env`);
    console.log('✅ .env updated with new password.');

    // 3. Restore Data from SQL file
    console.log('📥 Importing 1-month archive from vuc2026.sql ...');
    // We use --clean if possible, but the SQL file seems to have DROP TABLE commands already (from the head output)
    const restore = await ssh.execCommand(`psql "${newDbUrl}" < /var/www/escortvip/vuc2026.sql`);
    console.log('✅ Data restoration complete.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

restoreDatabase();
