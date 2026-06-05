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

    // 1. Kill old build processes if any exist
    console.log('🧹 [CLEANUP] Killing any orphaned Next.js build/worker processes...');
    await ssh.execCommand('pkill -f "next-router-worker" || true');
    await ssh.execCommand('pkill -f "next build" || true');
    
    // 2. Clear Next.js cache to avoid compilation cache issues
    console.log('🧹 [CACHE] Clearing Next.js build cache...');
    await ssh.execCommand('rm -rf /var/www/escortvip/.next');

    // 3. Start the build in the background using nohup
    console.log('🏗️ [BUILD] Launching Next.js production build in background...');
    const startRes = await ssh.execCommand(
      'nohup env NODE_OPTIONS="--max-old-space-size=2048" npm run build > build.log 2>&1 < /dev/null &',
      { cwd: '/var/www/escortvip' }
    );
    console.log('📡 nohup trigger result:', startRes.stdout || startRes.stderr || 'Sent to background.');

    console.log('✅ [SUCCESS] Next.js build started successfully in the background on the Attack Server!');
    ssh.dispose();
  } catch (e) {
    console.error('💥 Failed:', e);
    ssh.dispose();
  }
}

run();
