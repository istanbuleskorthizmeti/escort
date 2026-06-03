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
    console.log('Connected!');

    console.log('Curling http://213.232.235.181...');
    const res80 = await ssh.execCommand('curl -I http://213.232.235.181');
    console.log('HTTP Port 80:\n', res80.stdout || res80.stderr);

    console.log('Curling https://213.232.235.181...');
    const res443 = await ssh.execCommand('curl -I -k https://213.232.235.181');
    console.log('HTTPS Port 443:\n', res443.stdout || res443.stderr);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
