import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function peekInsideSql() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Peeking inside vuc2026.sql ...');
    
    // Count occurrences of "INSERT INTO \"PageContent\""
    const count = await ssh.execCommand('grep -c "INSERT INTO \\"PageContent\\"" /var/www/escortvip/vuc2026.sql');
    console.log('INSERT statements for PageContent:', count.stdout);

    // Look at the first few lines of data
    const head = await ssh.execCommand('grep "INSERT INTO \\"PageContent\\"" /var/www/escortvip/vuc2026.sql | head -n 1 | cut -c 1-500');
    console.log('Data Sample:', head.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

peekInsideSql();
