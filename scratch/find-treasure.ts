import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';

async function findTheTreasure() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Hunting for the content treasure...');
    
    // Count records per siteId
    const stats = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT \\"siteId\\", COUNT(*) FROM \\"PageContent\\" GROUP BY \\"siteId\\" ORDER BY COUNT(*) DESC;"`);
    console.log('--- CONTENT DISTRIBUTION ---');
    console.log(stats.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

findTheTreasure();
