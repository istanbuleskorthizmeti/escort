const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- PM2 Status on Attack Server ---');
    const pm2Status = await ssh.execCommand('pm2 jlist');
    const data = JSON.parse(pm2Status.stdout);
    data.forEach(p => {
      console.log(`[${p.pm_id}] Name: ${p.name}, PID: ${p.pid}, Status: ${p.pm2_env.status}, CPU: ${p.monit.cpu}%, MEM: ${(p.monit.memory/(1024*1024)).toFixed(1)}MB`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
