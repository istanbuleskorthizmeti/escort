const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  const cmd = process.argv[2] || 'ps aux | grep -i npm';
  try {
    await ssh.connect(config);
    console.log(`--- Running on server: ${cmd} ---`);
    const res = await ssh.execCommand(cmd);
    console.log(res.stdout || res.stderr || 'No output.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
