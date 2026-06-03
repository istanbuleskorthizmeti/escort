import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function testDbConn() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CREATING SCRATCH_TEST_DB.JS ON SERVER ---');
    await ssh.execCommand('echo "const { PrismaClient } = require(\'@prisma/client\'); const prisma = new PrismaClient(); prisma.adProfile.findFirst().then(p => console.log(\'SUCCESS:\', p ? p.id : \'no profiles found\')).catch(e => console.error(\'ERROR:\', e)).finally(() => prisma.\\$disconnect())" > /root/esc/scratch_test_db.js');

    console.log('\n--- TESTING PRISMA DATABASE QUERY ---');
    const result = await ssh.execCommand('node scratch_test_db.js', { cwd: '/root/esc' });
    console.log('STDOUT:', result.stdout);
    console.log('STDERR:', result.stderr);

    await ssh.execCommand('rm -f /root/esc/scratch_test_db.js');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

testDbConn();
