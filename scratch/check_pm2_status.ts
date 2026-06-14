import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function checkPm2Status() {
  try {
    await ssh.connect(config);
    console.log('🔗 Connected.');

    const pm2Status = await ssh.execCommand('pm2 status');
    console.log(pm2Status.stdout);

    ssh.dispose();
  } catch (err) {
    console.error(err);
    ssh.dispose();
  }
}

checkPm2Status();
