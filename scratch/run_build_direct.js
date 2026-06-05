const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Attack Server...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Starting direct next build...');
    
    // Kill any existing node/next processes first
    await ssh.execCommand('pkill -f "next build" || true');
    await ssh.execCommand('pkill -f "postcss" || true');
    
    const res = await ssh.exec('npm', ['run', 'build'], {
      cwd: '/var/www/escortvip',
      onStdout(chunk) {
        process.stdout.write(chunk.toString());
      },
      onStderr(chunk) {
        process.stderr.write(chunk.toString());
      }
    });
    console.log('\nBuild finished. Exit code:', res.code);
  } catch (e) {
    console.error('Error during execution:', e);
  } finally {
    ssh.dispose();
  }
}
run();
