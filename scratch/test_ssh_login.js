const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function testConnection() {
  const configs = [
    { host: '213.232.235.181', port: 22, username: 'root', password: '5TVuj6qiHMfh8CxH9O!' },
    { host: '213.232.235.181', port: 2222, username: 'root', password: '5TVuj6qiHMfh8CxH9O!' }
  ];

  for (const config of configs) {
    console.log(`Trying SSH to ${config.host}:${config.port}...`);
    try {
      await ssh.connect(config);
      console.log(`✅ SUCCESS! Logged in on port ${config.port}`);
      const res = await ssh.execCommand('uname -a && uptime');
      console.log('System Info:', res.stdout);
      ssh.dispose();
      return;
    } catch (err) {
      console.log(`❌ Failed on port ${config.port}: ${err.message}`);
    }
  }
}

testConnection();
