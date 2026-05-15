import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function debug500() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Debugging 500 Internal Server Error...');
    
    // 1. Check PM2 logs (last 50 lines)
    const logs = await ssh.execCommand('pm2 logs hydra-web --lines 50 --nostream');
    console.log('--- PM2 LOGS ---');
    console.log(logs.stdout || logs.stderr);

    // 2. Check Database connectivity
    console.log('\n🔍 Checking Database Connection...');
    const dbCheck = await ssh.execCommand('pg_isready -h localhost -p 5432');
    console.log('DB Status:', dbCheck.stdout);

    // 3. Verify .env file
    const envCheck = await ssh.execCommand('ls -la /root/hydra/.env');
    console.log('.env exists:', envCheck.stdout.includes('.env') ? 'YES' : 'NO');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

debug500();
