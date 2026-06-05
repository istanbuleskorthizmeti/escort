const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Production Server at 213.232.235.181...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    console.log('✅ SSH Connection to Production Server SUCCEEDED!');
  } catch (e) {
    console.error('❌ Connection Failed:', e.message);
  } finally {
    ssh.dispose();
  }
}
run();
