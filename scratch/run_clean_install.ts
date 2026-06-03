import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function runCleanInstall() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- REMOVING NODE_MODULES ---');
    await ssh.execCommand('rm -rf node_modules package-lock.json', { cwd: '/root/esc' });
    console.log('🗑️ Removed node_modules.');

    console.log('\n--- RUNNING NPM INSTALL WITH DEV DEPENDENCIES ---');
    const install = await ssh.execCommand('npm install --include=dev', { cwd: '/root/esc' });
    console.log('STDOUT:', install.stdout);
    console.log('STDERR:', install.stderr);

    console.log('\n--- CHECKING PRISMA VERSION ---');
    const prismaVer = await ssh.execCommand('npx prisma --version', { cwd: '/root/esc' });
    console.log('STDOUT:', prismaVer.stdout);
    console.log('STDERR:', prismaVer.stderr);

    console.log('\n--- RUNNING BUILD ---');
    const build = await ssh.execCommand('export NEXT_BUILD_WORKERS=1 && export NODE_OPTIONS="--max-old-space-size=2048" && npm run build', { cwd: '/root/esc' });
    console.log('STDOUT:', build.stdout);
    console.log('STDERR:', build.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

runCleanInstall();
