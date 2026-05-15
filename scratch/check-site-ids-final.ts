import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';

async function checkSiteIdsFinal() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking siteId for restored content...');
    
    const res = await ssh.execCommand(`psql "${dbUrl}" -t -c "SELECT \\"siteId\\", COUNT(*) FROM \\"PageContent\\" GROUP BY 1 LIMIT 5;" 2>&1`);
    console.log('Result:', res.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkSiteIdsFinal();
