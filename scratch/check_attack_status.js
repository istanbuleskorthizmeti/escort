const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Attack Hub (187.77.111.203)...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Connected!');

    console.log('\n--- 1. Directory contents of /root/hydra ---');
    const lsRes = await ssh.execCommand('ls -la /root/hydra');
    console.log(lsRes.stdout);

    console.log('\n--- 2. Checking if npm install is running ---');
    const psRes = await ssh.execCommand('ps aux | grep -i npm');
    console.log(psRes.stdout);

    console.log('\n--- 3. PM2 list on Attack Hub ---');
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log(pm2Res.stdout);

    console.log('\n--- 4. Checking git status on Attack Hub ---');
    const gitRes = await ssh.execCommand('git status', { cwd: '/root/hydra' });
    console.log(gitRes.stdout || gitRes.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

run();
