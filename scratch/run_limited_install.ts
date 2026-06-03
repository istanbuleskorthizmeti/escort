import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function runLimitedInstall() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- CLEANING OLD NODE_MODULES ---');
    await ssh.execCommand('rm -rf node_modules package-lock.json', { cwd: '/root/esc' });

    console.log('\n--- RUNNING MEMORY-LIMITED NPM INSTALL ---');
    const install = await ssh.execCommand('export NODE_OPTIONS="--max-old-space-size=1024" && npm install --no-audit --no-fund --include=dev', { cwd: '/root/esc' });
    console.log('EXIT CODE:', install.code);
    console.log('STDOUT:', install.stdout);
    console.log('STDERR:', install.stderr);

    if (install.code !== 0) {
      console.log('❌ Install failed.');
      ssh.dispose();
      return;
    }

    console.log('\n--- RUNNING PRISMA GENERATE ---');
    const prisma = await ssh.execCommand('npx prisma generate', { cwd: '/root/esc' });
    console.log('STDOUT:', prisma.stdout);
    console.log('STDERR:', prisma.stderr);

    console.log('\n--- RUNNING BUILD ---');
    const build = await ssh.execCommand('export NEXT_BUILD_WORKERS=1 && export NEXT_PRIVATE_WORKER_THREADS=false && export NODE_OPTIONS="--max-old-space-size=2048" && npx next build', { cwd: '/root/esc' });
    console.log('STDOUT:', build.stdout);
    console.log('STDERR:', build.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

runLimitedInstall();
