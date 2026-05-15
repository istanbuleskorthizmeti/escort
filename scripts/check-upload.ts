import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function check() {
  try {
    await ssh.connect(config);
    const res = await ssh.execCommand('ls -lh /root/surgical_bundle.zip');
    console.log('📦 Remote file:', res.stdout || 'NOT FOUND');
    ssh.dispose();
  } catch (e) {
    console.error(e);
  }
}

check();
