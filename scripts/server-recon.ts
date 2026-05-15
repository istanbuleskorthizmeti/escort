import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function recon() {
  try {
    await ssh.connect(config);
    console.log('--- RECURSIVE RECON ---');
    const ls = await ssh.execCommand('ls -R /root/esc');
    console.log(ls.stdout);
    ssh.dispose();
  } catch (e) {
    console.error(e);
  }
}

recon();
