import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkRemoteModules() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- LS -LA NODE_MODULES/PRISMA ---');
    const prismaDir = await ssh.execCommand('ls -la node_modules/prisma 2>/dev/null || echo "prisma not found in node_modules"');
    console.log(prismaDir.stdout);

    console.log('\n--- LS -LA NODE_MODULES/.BIN ---');
    const binDir = await ssh.execCommand('ls -la node_modules/.bin 2>/dev/null || echo "bin not found in node_modules"');
    console.log(binDir.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkRemoteModules();
