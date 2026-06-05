const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Restarting PM2 process "escortvip" ---');
    const restartRes = await ssh.execCommand('pm2 restart escortvip');
    console.log(restartRes.stdout || restartRes.stderr);

    console.log('Waiting 5 seconds for Next.js to initialize...');
    await new Promise(r => setTimeout(r, 5000));

    console.log('--- Checking active ports ---');
    const portRes = await ssh.execCommand('netstat -lntp | grep :3000');
    console.log(portRes.stdout || 'Nothing listening on port 3000.');

    console.log('--- checking PM2 status ---');
    const statusRes = await ssh.execCommand('pm2 show escortvip');
    console.log(statusRes.stdout || statusRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
