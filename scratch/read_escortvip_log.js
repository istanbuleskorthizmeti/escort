const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    
    console.log('Finding log files matching escortvip-error...');
    const findRes = await ssh.execCommand('ls -t /root/.pm2/logs/escortvip-error*.log | head -n 3');
    console.log('Recent log files:\n', findRes.stdout || 'None found');

    const logs = findRes.stdout.trim().split('\n').filter(Boolean);
    for (const log of logs) {
      console.log(`\n=== Reading last 20 lines of ${log} ===`);
      const catRes = await ssh.execCommand(`tail -n 20 ${log}`);
      console.log(catRes.stdout || catRes.stderr || '(empty)');
    }
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
