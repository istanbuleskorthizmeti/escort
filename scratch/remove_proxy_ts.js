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

    console.log('🚚 [CLEANUP] Moving conflicting proxy.ts to backup location outside the project...');
    const moveRes = await ssh.execCommand('mv /var/www/escortvip/proxy.ts /root/proxy.ts.bak || true');
    console.log(moveRes.stdout || moveRes.stderr || 'Moved successfully.');

    // Start next build again
    console.log('🧹 [CLEANUP] Killing any orphaned Next.js build/worker processes...');
    await ssh.execCommand('pkill -f "next-router-worker" || true');
    await ssh.execCommand('pkill -f "next build" || true');
    
    console.log('🧹 [CACHE] Clearing Next.js build cache...');
    await ssh.execCommand('rm -rf /var/www/escortvip/.next');

    console.log('🏗️ [BUILD] Re-launching Next.js production build in background...');
    const startRes = await ssh.execCommand(
      'nohup env NODE_OPTIONS="--max-old-space-size=2048" npm run build > build.log 2>&1 < /dev/null &',
      { cwd: '/var/www/escortvip' }
    );
    console.log('📡 nohup trigger result:', startRes.stdout || startRes.stderr || 'Sent to background.');

    console.log('✅ [SUCCESS] Conflicting file removed and build re-started!');
    ssh.dispose();
  } catch (e) {
    console.error('💥 Failed:', e);
    ssh.dispose();
  }
}

run();
