import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function deepAudit() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Deep Audit: Scanning for hidden databases and tables...');
    
    // 1. List all Databases
    const dbs = await ssh.execCommand('psql -U postgres -c "\\l"').catch(() => ({stdout: 'Permission denied for \l'}));
    console.log('--- DATABASES ---');
    console.log(dbs.stdout);

    // 2. List all Tables in vuc2026
    const dbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';
    const tables = await ssh.execCommand(`psql "${dbUrl}" -c "\\dt"`);
    console.log('\n--- TABLES IN vuc2026 ---');
    console.log(tables.stdout);

    // 3. Search for large tables
    const sizes = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;"`);
    console.log('\n--- TABLE SIZES (Row Counts) ---');
    console.log(sizes.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

deepAudit();
