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

    console.log('🔍 Querying ShortLink table on VPS with localhost bypass:');
    const queryRes = await ssh.execCommand('node -e "require(\'dotenv\').config(); if (process.env.DATABASE_URL) { process.env.DATABASE_URL = process.env.DATABASE_URL.replace(\'213.232.235.181\', \'localhost\'); } const { PrismaClient } = require(\'@prisma/client\'); const p = new PrismaClient(); p.shortLink.findMany().then(r => console.log(JSON.stringify(r, null, 2))).catch(console.error);"', { cwd: '/root/esc' });
    
    console.log('STDOUT:', queryRes.stdout);
    console.log('STDERR:', queryRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
