import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function peekTelegramData() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Peeking inside escort_posts.json ...');
    
    const head = await ssh.execCommand('head -n 50 /var/www/escortvip/data/telegram_logs/escort_posts.json');
    console.log('--- JSON HEAD ---');
    console.log(head.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

peekTelegramData();
