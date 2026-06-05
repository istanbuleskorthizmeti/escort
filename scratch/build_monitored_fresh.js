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
    await ssh.execCommand('pkill -f "next build" || true');
    await ssh.execCommand('pkill -f "next-build" || true');
    await ssh.execCommand('pkill -f "prisma generate" || true');
    
    // Clear next cache to make sure it's not poisoned
    await ssh.execCommand('rm -rf /var/www/escortvip/.next/cache || true');
    
    console.log('--- Triggering fresh build after fixes ---');
    await ssh.execCommand('cd /var/www/escortvip && NODE_OPTIONS="--max-old-space-size=2048" nohup npm run build > build.log 2>&1 < /dev/null &');
    
    console.log('Build triggered. We will check build.log in 3 seconds...');
    await new Promise(r => setTimeout(r, 3000));
    const logRes = await ssh.execCommand('tail -n 30 /var/www/escortvip/build.log');
    console.log(logRes.stdout || 'build.log is empty.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
