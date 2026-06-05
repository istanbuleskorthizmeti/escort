const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Stopping and deleting old PM2 configurations to relieve CPU pressure...');
    // escortvip process ID 1 and 6 represent old/redundant definitions
    // escortvip is waiting restart or failing. Let's stop/delete it.
    await ssh.execCommand('pm2 delete escortvip || true');
    await ssh.execCommand('pm2 delete escortvip-gtm-backend || true');
    await ssh.execCommand('pm2 delete escortvip-orchestrator || true');
    await ssh.execCommand('pm2 delete escortvip-reporter || true');
    await ssh.execCommand('pm2 delete escortvip-aggressive-ping || true');
    
    // Check processes now
    const pm2Res = await ssh.execCommand('pm2 list');
    console.log('New PM2 List:\n', pm2Res.stdout);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
