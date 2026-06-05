const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('📡 Connecting to Attack Server (187.77.111.203) to build Next.js app...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('✅ Connected!');

    console.log('🏗️ Running npm run build in /var/www/escortvip...');
    const buildRes = await ssh.execCommand('NODE_OPTIONS="--max-old-space-size=2048" npm run build', {
      cwd: '/var/www/escortvip'
    });
    console.log('Build Stdout:\n', buildRes.stdout);
    console.log('Build Stderr:\n', buildRes.stderr);

    if (buildRes.code === 0) {
      console.log('✅ Build successful! Restarting PM2 process...');
      const restartRes = await ssh.execCommand('pm2 restart escortvip');
      console.log(restartRes.stdout || restartRes.stderr);
      console.log('✅ PM2 process restarted!');
    } else {
      console.error('❌ Build failed with code:', buildRes.code);
    }

  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
