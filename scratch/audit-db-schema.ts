import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';

async function auditDatabase() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📊 Auditing PostgreSQL Schema on Escort Server...');
    
    // Check tables
    const tables = await ssh.execCommand(`psql "${dbUrl}" -c "\\dt"`);
    console.log('--- TABLES ---');
    console.log(tables.stdout);

    // Check PageContent columns
    const columns = await ssh.execCommand(`psql "${dbUrl}" -c "\\d \\"PageContent\\""`);
    console.log('\n--- PageContent COLUMNS ---');
    console.log(columns.stdout);

    // Check if Site table exists
    const sites = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT COUNT(*) FROM \\"Site\\";"`);
    console.log('\n--- Site COUNT ---');
    console.log(sites.stdout || 'Site table might be missing.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

auditDatabase();
