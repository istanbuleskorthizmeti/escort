const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
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
