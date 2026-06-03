const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('Connecting to Attack (187.77.111.203)...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('Connected to Attack!');

    // Check if Attack can reach Escort's port 22
    console.log('Testing connection to Escort (213.232.235.181) port 22 from Attack...');
    const ncRes = await ssh.execCommand('nc -zv -w 3 213.232.235.181 22');
    console.log('nc output:', ncRes.stdout || ncRes.stderr);

    // Try a simple ping from Attack to Escort
    console.log('Testing ping to Escort from Attack...');
    const pingRes = await ssh.execCommand('ping -c 3 213.232.235.181');
    console.log('ping output:', pingRes.stdout || pingRes.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
