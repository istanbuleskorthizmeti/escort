const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Triggering Next.js build with output to build.log (detached) ---');
    const buildRes = await ssh.execCommand('cd /var/www/escortvip && NODE_OPTIONS="--max-old-space-size=2048" nohup npm run build > build.log 2>&1 < /dev/null &');
    console.log('Command executed. Checking log file...');
    
    // Wait 2 seconds and print initial log content
    await new Promise(r => setTimeout(r, 2000));
    const logRes = await ssh.execCommand('head -n 20 /var/www/escortvip/build.log');
    console.log(logRes.stdout || 'Log file empty or not created yet.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
