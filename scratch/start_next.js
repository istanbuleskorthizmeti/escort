const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Starting Next.js app on PM2 ---');
    // We start the next app using pm2
    const startRes = await ssh.execCommand('pm2 start npm --name "escortvip" --cwd "/var/www/escortvip" -- run start');
    console.log(startRes.stdout || startRes.stderr);

    console.log('--- PM2 List ---');
    const pm2List = await ssh.execCommand('pm2 list');
    console.log(pm2List.stdout);

    console.log('--- Checking port 3000 after start ---');
    // Wait 3 seconds for start to boot up
    await new Promise(r => setTimeout(r, 3000));
    const portRes = await ssh.execCommand('netstat -lntp | grep :3000');
    console.log(portRes.stdout || 'Nothing listening on port 3000 yet.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
