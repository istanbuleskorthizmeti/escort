const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixServer() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('✅ Connected to Main Server');
    
    // 1. Fix server.js syntax
    console.log('--- FIXING server.js ---');
    const fixCmd = `sed -i "s/const dev = process.env.NODE_ENV '== 'production';/const dev = process.env.NODE_ENV !== 'production';/g" server.js`;
    await ssh.execCommand(fixCmd, { cwd: '/root/esc' });
    
    const check = await ssh.execCommand('cat server.js', { cwd: '/root/esc' });
    console.log(check.stdout);

    // 2. Clear PM2 and restart
    console.log('--- RESTARTING CLUSTER ---');
    await ssh.execCommand('pm2 delete drkcnay-web-cluster || true');
    await ssh.execCommand('pm2 start ecosystem.config.js');
    
    // 3. FIX PERMISSIONS (403 fix)
    console.log('--- FIXING PERMISSIONS (403) ---');
    await ssh.execCommand('chmod 755 /root');
    await ssh.execCommand('chmod -R 755 /root/esc');

    ssh.dispose();
    console.log('🏁 FIX COMPLETE.');
  } catch (err) {
    console.error('❌ SSH Error:', err);
    ssh.dispose();
  }
}

fixServer();
