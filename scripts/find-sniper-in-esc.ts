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
    console.log('✅ Connected.');

    const locateRes = await ssh.execCommand('find /root/esc/ -name "*sniper*.js" -o -name "*sniper*.ts"');
    console.log('Results:');
    console.log(locateRes.stdout || 'None found');

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
