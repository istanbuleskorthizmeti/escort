import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

const scriptCode = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const profiles = await prisma.adProfile.findMany();
    console.log('📊 DATABASE AD PROFILES:', profiles);
    process.exit(0);
  } catch (e) {
    console.error('DB Error:', e.message);
    process.exit(1);
  }
}

check();
`;

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    console.log('📤 Uploading check_db.js to production scripts...');
    await ssh.execCommand(`cat << 'EOF' > /root/esc/scripts/check_db.js\n${scriptCode}\nEOF`);
    console.log('📡 Running DB check script inside app root...');
    const runRes = await ssh.execCommand('node scripts/check_db.js', { cwd: '/root/esc' });
    console.log(runRes.stdout || runRes.stderr);
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
