const { NodeSSH } = require('node-ssh');

async function test() {
  const ssh = new NodeSSH();
  try {
    console.log('Trying SSH connection to 213.232.235.181 on port 2222...');
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!',
      readyTimeout: 10000
    });
    console.log('🎉 CONNECTED SUCCESSFULLY ON PORT 2222!');
    const uptime = await ssh.execCommand('uptime');
    console.log('Uptime:', uptime.stdout);
    ssh.dispose();
  } catch (e) {
    console.error('❌ Failed on port 2222:', e.message);
    ssh.dispose();
  }
}

test();
