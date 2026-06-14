import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable';

async function checkContent() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📝 Checking PageContent for istanbulescort.blog ...');
    
    const siteId = 'cmp345juw000gzwqneu6js99o';
    const content = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT slug, title FROM \\"PageContent\\" WHERE \\"siteId\\" = '${siteId}' LIMIT 20;"`);
    console.log(content.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkContent();
