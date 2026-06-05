import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('=== exxvideos.shop Response ===');
    const res = await ssh.execCommand('curl -s https://exxvideos.shop/ | head -c 1000');
    console.log(res.stdout || res.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}

run();
