const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function nuclearRestart() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('🗑️ [PM2] Deleting all...');
    await ssh.execCommand('pm2 delete all');

    console.log('🚀 [PM2] Starting from ecosystem...');
    const start = await ssh.execCommand('pm2 start ecosystem.config.js', { cwd: '/root/esc' });
    console.log(start.stdout);

    console.log('📊 [PM2] List:');
    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);

    console.log('🔍 [PM2] Checking drkcnay-web-cluster logs...');
    const logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 50 --flush');
    console.log(logs.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

nuclearRestart();
