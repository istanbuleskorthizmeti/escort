const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    const command = process.argv[2] || 'ls -la /root';
    const result = await ssh.execCommand(command, { cwd: '/root/esc' });
    
    console.log('STDOUT:\n' + result.stdout);
    if(result.stderr) console.log('STDERR:\n' + result.stderr);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
