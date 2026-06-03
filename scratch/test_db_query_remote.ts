import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testDb() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- TESTING DATABASE ACCESS (PRISMA SCHEMA VALIDATION) ---');
    const dbRes = await ssh.execCommand('npx prisma db pull', { cwd: '/root/esc' });
    console.log(dbRes.stdout || dbRes.stderr);

    console.log('\n--- SYSTEMCTL STATUS POSTGRESQL ---');
    const pgRes = await ssh.execCommand('systemctl status postgresql');
    console.log(pgRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testDb();
