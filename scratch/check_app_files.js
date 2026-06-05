const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkAppFiles() {
  const config = {
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  };

  try {
    await ssh.connect(config);
    console.log('✅ Connected. Listing app directories...');

    console.log('\n=== 1. Root Directory Listing (ls -la /root) ===');
    const rootRes = await ssh.execCommand('ls -la /root');
    console.log(rootRes.stdout);

    console.log('\n=== 2. Home Directory Listing (ls -la /home) ===');
    const homeRes = await ssh.execCommand('ls -la /home');
    console.log(homeRes.stdout);

    console.log('\n=== 3. Nginx Configuration files (ls -la /etc/nginx/sites-enabled) ===');
    const nginxRes = await ssh.execCommand('ls -la /etc/nginx/sites-enabled');
    console.log(nginxRes.stdout);

    console.log('\n=== 4. Contents of Nginx default config ===');
    const nginxConfRes = await ssh.execCommand('cat /etc/nginx/sites-enabled/* | head -n 50');
    console.log(nginxConfRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('❌ Check failed:', err.message);
    ssh.dispose();
  }
}

checkAppFiles();
