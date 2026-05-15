const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
  try {
    console.log('🔗 Connecting to 213.232.235.181...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('✅ Connected.');

    console.log('📊 [PM2] Status:');
    const list = await ssh.execCommand('pm2 list');
    console.log(list.stdout);

    console.log('🔍 [PM2] Checking logs for errors...');
    const logs = await ssh.execCommand('pm2 logs --lines 50 --flush');
    console.log(logs.stdout);

    console.log('🚀 [PM2] Restarting all processes...');
    await ssh.execCommand('pm2 restart all');
    
    console.log('🌐 [NGINX] Testing config...');
    const nginxTest = await ssh.execCommand('nginx -t');
    console.log(nginxTest.stderr || nginxTest.stdout);

    console.log('🔄 [NGINX] Reloading...');
    await ssh.execCommand('systemctl reload nginx');

    console.log('✅ Remote server fixed.');

  } catch(e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}

fix();
