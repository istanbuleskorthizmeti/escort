import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function peekDevDb() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Inspecting SQLite dev.db ...');
    
    // 1. Check file size
    const size = await ssh.execCommand('ls -lh /root/hydra/prisma/dev.db');
    console.log('Size:', size.stdout);

    // 2. Try to list tables in SQLite
    const tables = await ssh.execCommand('sqlite3 /root/hydra/prisma/dev.db ".tables"');
    console.log('Tables:', tables.stdout || 'sqlite3 not installed or failed.');

    // 3. Count PageContent in SQLite
    const count = await ssh.execCommand('sqlite3 /root/hydra/prisma/dev.db "SELECT COUNT(*) FROM PageContent;"');
    console.log('PageContent Count (SQLite):', count.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

peekDevDb();
