import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';

async function checkOldSiteContent() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📝 Checking PageContent for escortvip.net (The main archive?) ...');
    
    const siteId = 'cmp347hog000cqadjidek7q6b';
    const count = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT COUNT(*) FROM \\"PageContent\\" WHERE \\"siteId\\" = '${siteId}';"`);
    console.log('Total Records:', count.stdout);

    const samples = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT slug, title FROM \\"PageContent\\" WHERE \\"siteId\\" = '${siteId}' LIMIT 10;"`);
    console.log('Samples:', samples.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkOldSiteContent();
