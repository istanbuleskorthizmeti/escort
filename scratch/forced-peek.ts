import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';

async function forcedPeek() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Forced Peek at PageContent data...');
    
    // Capture both stdout and stderr
    const res = await ssh.execCommand(`psql "${dbUrl}" -t -c "SELECT id, slug, title FROM \\"PageContent\\" LIMIT 5;" 2>&1`);
    console.log('Result:', res.stdout);
    if (res.stderr) console.log('Error:', res.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

forcedPeek();
