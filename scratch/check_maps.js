const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('=== Checking memory maps of the SSH shell ===');
    const mapsRes = await ssh.execCommand('cat /proc/self/maps | grep -i -E "libsystem|data|let|lrt|xmrig" || echo "none"');
    console.log(mapsRes.stdout || mapsRes.stderr);

    console.log('\n=== Checking env variables of the SSH shell ===');
    const envRes = await ssh.execCommand('env');
    console.log(envRes.stdout || envRes.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
