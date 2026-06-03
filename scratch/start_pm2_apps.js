const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Restarting Next.js Web cluster and Hydra Bot services ---');

    console.log('1. Checking system status...');
    const freeRes = await ssh.execCommand('free -m');
    console.log('Memory:\n', freeRes.stdout);

    console.log('2. Starting pm2 applications from ecosystem.config.js...');
    // We navigate to /root/esc/ and run pm2 start ecosystem.config.js
    const pm2Start = await ssh.execCommand('cd /root/esc && pm2 start ecosystem.config.js || pm2 start ecosystem.config.js');
    console.log('PM2 Start Output:\n', pm2Start.stdout || pm2Start.stderr);

    console.log('3. Checking active PM2 status list...');
    const pm2List = await ssh.execCommand('pm2 list');
    console.log(pm2List.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
