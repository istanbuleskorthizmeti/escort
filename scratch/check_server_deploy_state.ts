import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function check() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    const files = await ssh.execCommand('ls -lh /root');
    console.log('--- /root files ---');
    console.log(files.stdout);

    const escDir = await ssh.execCommand('ls -lh /root/esc');
    console.log('--- /root/esc files ---');
    console.log(escDir.stdout);

    ssh.dispose();
  } catch (e) {
    console.error('💥 Error:', e);
    ssh.dispose();
  }
}

check();
