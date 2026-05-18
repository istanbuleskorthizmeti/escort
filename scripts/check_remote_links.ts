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

    console.log('🔍 Querying ShortLink table on VPS:');
    const queryRes = await ssh.execCommand('node -e "const { PrismaClient } = require(\'@prisma/client\'); const p = new PrismaClient(); p.shortLink.findMany().then(console.log).catch(console.error);"', { cwd: '/root/esc' });
    
    console.log('STDOUT:', queryRes.stdout);
    console.log('STDERR:', queryRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
