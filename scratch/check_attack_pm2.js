const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    const pm2Res = await ssh.execCommand('pm2 jlist');
    const processes = JSON.parse(pm2Res.stdout);
    console.log('PM2 Processes on Attack Server:');
    processes.forEach(p => {
      console.log(`- [${p.pm_id}] Name: ${p.name}, Status: ${p.pm2_env.status}, CPU: ${p.monit.cpu}%, Mem: ${(p.monit.memory/(1024*1024)).toFixed(1)}MB`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
