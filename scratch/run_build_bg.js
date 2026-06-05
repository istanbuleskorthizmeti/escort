const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- starting build in background via nohup ---');
    // Kill any existing build first
    await ssh.execCommand('pkill -f "next build" || true');
    await ssh.execCommand('pkill -f "postcss" || true');
    
    // Start build and redirect input/output to detach from SSH terminal
    const startRes = await ssh.execCommand(
      'cd /var/www/escortvip && nohup env NODE_OPTIONS="--max-old-space-size=2048" npm run build > build.log 2>&1 < /dev/null &'
    );
    console.log('Background build command triggered:', startRes.stdout || startRes.stderr || 'No direct output (detached)');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
