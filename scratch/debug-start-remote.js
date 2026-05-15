const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function debugStart() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('🚀 Attempting manual start with NEW NAME...');
    const start = await ssh.execCommand('pm2 start npm --name "hydra-web" -- run start', { cwd: '/root/esc' });
    console.log(start.stdout || start.stderr);

    console.log('📊 Waiting 3s...');
    await new Promise(r => setTimeout(r, 3000));
    
    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);

    console.log('🔍 Showing details for hydra-web...');
    const show = await ssh.execCommand('pm2 show hydra-web');
    console.log(show.stdout);

    const logs = await ssh.execCommand('pm2 logs hydra-web --lines 50 --flush');
    console.log(logs.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

debugStart();
