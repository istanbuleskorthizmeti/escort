import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    console.log('\n--- HYDRA (.env) ---');
    const hydraEnv = await ssh.execCommand('grep "PORT" /root/hydra/.env');
    console.log(hydraEnv.stdout || 'No PORT found in .env');

    console.log('\n--- ESCORTVIP (.env) ---');
    const escortEnv = await ssh.execCommand('grep "PORT" /var/www/escortvip/.env');
    console.log(escortEnv.stdout || 'No PORT found in .env');

    console.log('\n--- PM2: SHOW HYDRA-WEB ---');
    const pm2Show = await ssh.execCommand('pm2 show hydra-web');
    console.log(pm2Show.stdout);

    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
