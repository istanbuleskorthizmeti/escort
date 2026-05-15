import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkOldEnv() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🔍 Reading old .env from /var/www/escortvip/ ...');
    
    const env = await ssh.execCommand('cat /var/www/escortvip/.env');
    console.log(env.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkOldEnv();
