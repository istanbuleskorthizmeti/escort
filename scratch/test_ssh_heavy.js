const { NodeSSH } = require('node-ssh');

async function run() {
  const ssh = new NodeSSH();
  try {
    console.log('Attempting heavy SSH connection to 213.232.235.181 with 60s timeout...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!',
      readyTimeout: 60000,
      keepaliveInterval: 10000,
      keepaliveCountMax: 10
    });
    console.log('✅ CONNECTED SUCCESSFUL!');
    const uptime = await ssh.execCommand('uptime');
    console.log('Uptime:', uptime.stdout);
    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
    ssh.dispose();
  }
}

run();
