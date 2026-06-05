const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- All PM2 processes (including stopped/errored) ---');
    const pm2Status = await ssh.execCommand('pm2 jlist');
    const data = JSON.parse(pm2Status.stdout);
    data.forEach(p => {
      console.log(`[${p.pm_id}] Name: ${p.name}, Status: ${p.pm2_env.status}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
