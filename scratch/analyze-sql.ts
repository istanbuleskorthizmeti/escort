import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function analyzeSqlFormat() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Analyzing SQL File Format...');
    
    const head = await ssh.execCommand('head -n 100 /var/www/escortvip/vuc2026.sql');
    console.log('--- SQL HEAD ---');
    console.log(head.stdout);

    // Check for COPY command
    const copyCount = await ssh.execCommand('grep -c "COPY public.\\"PageContent\\"" /var/www/escortvip/vuc2026.sql');
    console.log('COPY statements for PageContent:', copyCount.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

analyzeSqlFormat();
