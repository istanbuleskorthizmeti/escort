const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  const queryScript = `
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  try {
    console.log('=== Remote DB Settings ===');
    const settings = await prisma.systemSetting.findMany();
    console.log(JSON.stringify(settings, null, 2));
    
    console.log('=== Remote DB BotLocks ===');
    const locks = await prisma.botLock.findMany();
    console.log(JSON.stringify(locks, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
  `;

  console.log('Creating scratch directory if needed...');
  await ssh.execCommand('mkdir -p /root/esc/scratch');

  console.log('Writing query script to remote server...');
  await ssh.execCommand(`cat << 'EOF' > /root/esc/query_db_on_server.js\n${queryScript}\nEOF`);

  console.log('Executing query script on remote server...');
  const res = await ssh.execCommand('node query_db_on_server.js', { cwd: '/root/esc' });
  console.log('Output:\n', res.stdout);
  console.log('Errors:\n', res.stderr);

  ssh.dispose();
}

main().catch(console.error);
