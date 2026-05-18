import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🔍 Checking running services and listening ports:');
    const netstatRes = await ssh.execCommand('ss -tulpn || netstat -tulpn');
    console.log('STDOUT:', netstatRes.stdout);
    console.log('STDERR:', netstatRes.stderr);

    console.log('\n🔍 Checking Postgres connection locally on VPS via pg_isready:');
    const pgReady = await ssh.execCommand('pg_isready -h localhost -p 5432 || pg_isready');
    console.log('pg_isready:', pgReady.stdout || pgReady.stderr || 'Not found');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
