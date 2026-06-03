const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Trying SSH connection to 213.232.235.181 on port 22...');
    await ssh.connect({
      host: '213.232.235.181',
      port: 22,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!',
      readyTimeout: 5000
    });
    console.log('🎉 CONNECTED SUCCESSFULLY ON PORT 22!');
    const uptime = await ssh.execCommand('uptime');
    console.log('Uptime:', uptime.stdout);
  } catch (e) {
    console.error('❌ Failed on port 22:', e.message);
  } finally {
    ssh.dispose();
  }
}
run();
