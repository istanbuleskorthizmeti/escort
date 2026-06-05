const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🔐 [CONNECTING] Connecting to server...');
    await ssh.connect(config);

    console.log('📦 [NPM] Installing dependencies on server...');
    const installRes = await ssh.execCommand('npm install --legacy-peer-deps', { cwd: '/var/www/escortvip' });
    console.log(installRes.stdout || installRes.stderr);

    if (installRes.code !== 0) {
      console.warn('npm install had some issues, running --force...');
      const forceRes = await ssh.execCommand('npm install --force', { cwd: '/var/www/escortvip' });
      console.log(forceRes.stdout || forceRes.stderr);
    }

    console.log('✅ [SUCCESS] Dependencies installed. Re-starting Next.js build...');
    
    // Start next build again
    await ssh.execCommand('pkill -f "next-router-worker" || true');
    await ssh.execCommand('pkill -f "next build" || true');
    await ssh.execCommand('rm -rf /var/www/escortvip/.next');

    const startRes = await ssh.execCommand(
      'nohup env NODE_OPTIONS="--max-old-space-size=2048" npm run build > build.log 2>&1 < /dev/null &',
      { cwd: '/var/www/escortvip' }
    );
    console.log('📡 nohup trigger result:', startRes.stdout || startRes.stderr || 'Sent to background.');

    ssh.dispose();
  } catch (e) {
    console.error('💥 Failed:', e);
    ssh.dispose();
  }
}

run();
