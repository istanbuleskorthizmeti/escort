import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testDbDetailed() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- VERIFYING PG PROCESSES ---');
    const psRes = await ssh.execCommand('ps aux | grep postgres');
    console.log(psRes.stdout);

    console.log('\n--- DETAILED PRISMA DB PULL ERR ---');
    const prismaRes = await ssh.execCommand('npx prisma db pull', { cwd: '/root/esc' });
    console.log('STDOUT:', prismaRes.stdout);
    console.log('STDERR:', prismaRes.stderr);

    console.log('\n--- SYSTEMCTL STATUS POSTGRESQL ALL ---');
    const statusRes = await ssh.execCommand('systemctl status "postgresql*"');
    console.log(statusRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testDbDetailed();
