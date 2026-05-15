const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function forceStartWeb() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('🚀 Attempting manual start of drkcnay-web-cluster...');
    // Using npx for better compatibility
    const start = await ssh.execCommand('pm2 start "npm run start" --name "drkcnay-web-cluster"', { cwd: '/root/esc' });
    console.log(start.stdout || start.stderr);

    console.log('📊 Waiting 5s then checking status...');
    await new Promise(r => setTimeout(r, 5000));
    
    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);

    const logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 20 --flush');
    console.log(logs.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

forceStartWeb();
