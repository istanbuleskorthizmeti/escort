const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Cleaning up any dangling next build processes ---');
    // Find next build processes (excluding the main one we want to keep if we can, or just kill all of them and restart clean once)
    // Let's kill all next/node build processes to start 100% fresh and clean, ensuring no duplicates.
    await ssh.execCommand('pkill -f "next build" || true');
    await ssh.execCommand('pkill -f "next-build" || true');
    await ssh.execCommand('pkill -f "prisma generate" || true');
    
    // Also remove the next cache to avoid lockfiles
    await ssh.execCommand('rm -rf /var/www/escortvip/.next/cache || true');
    
    console.log('--- Triggering fresh clean Next.js build ---');
    await ssh.execCommand('cd /var/www/escortvip && NODE_OPTIONS="--max-old-space-size=2048" nohup npm run build > build.log 2>&1 &');
    
    console.log('Clean build triggered. Checking log file in 3 seconds...');
    await new Promise(r => setTimeout(r, 3000));
    const logRes = await ssh.execCommand('cat /var/www/escortvip/build.log');
    console.log(logRes.stdout || 'build.log is empty.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
