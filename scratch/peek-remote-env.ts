import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('📡 SSH Connection Successful.');
    
    console.log('--- REMOTE .env DATABASE_URL ---');
    const dbUrl = await ssh.execCommand('grep DATABASE_URL /root/esc/.env');
    console.log(dbUrl.stdout || dbUrl.stderr);
    
    console.log('\n--- REMOTE .env FULL ---');
    const fullEnv = await ssh.execCommand('cat /root/esc/.env');
    console.log(fullEnv.stdout || fullEnv.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  }
}

run();
