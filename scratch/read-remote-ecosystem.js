const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function readRemoteEcosystem() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    const result = await ssh.execCommand('cat ecosystem.config.js', { cwd: '/root/esc' });
    console.log(result.stdout);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

readRemoteEcosystem();
