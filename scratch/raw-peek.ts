import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';

async function rawPeek() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Raw Peek at PageContent data...');
    
    const res = await ssh.execCommand(`psql "${dbUrl}" -c "SELECT id, \\"siteId\\", slug, title FROM \\"PageContent\\" LIMIT 5;"`);
    console.log(res.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

rawPeek();
