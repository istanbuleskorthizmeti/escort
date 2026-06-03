import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function restartPg() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- 1. RESTARTING POSTGRESQL CLUSTER ---');
    const restartRes = await ssh.execCommand('systemctl restart postgresql@16-main');
    console.log('Restart output:', restartRes.stdout || restartRes.stderr || 'SUCCESS');

    console.log('\n--- 2. RETRYING PRISMA DB PULL ---');
    const prismaRes = await ssh.execCommand('npx prisma db pull', { cwd: '/root/esc' });
    console.log('STDOUT:', prismaRes.stdout);
    console.log('STDERR:', prismaRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

restartPg();
