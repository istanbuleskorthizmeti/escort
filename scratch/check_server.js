const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to 213.232.235.181...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    console.log('Connected!');

    // Get CPU utilization and top processes
    const cmd = 'ps aux --sort=-pcpu | head -n 20';
    console.log(`Running: ${cmd}`);
    const result = await ssh.execCommand(cmd);
    console.log('STDOUT:\n' + result.stdout);
    if(result.stderr) console.log('STDERR:\n' + result.stderr);

    // Also check system uptime/load average
    const uptimeResult = await ssh.execCommand('uptime');
    console.log('UPTIME:\n' + uptimeResult.stdout);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
