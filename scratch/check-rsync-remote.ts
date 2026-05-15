import { NodeSSH } from 'node-ssh';

const servers = [
  { host: '213.232.235.181', user: 'root', pass: '4TVuj7qiHMfh7CxH6K!' },
  { host: '45.93.137.164', user: 'root', pass: 'Z4-nN8JfiUIh5,;g' }
];

async function check() {
  for (const s of servers) {
    const ssh = new NodeSSH();
    try {
      await ssh.connect({ host: s.host, username: s.user, password: s.pass });
      const res = await ssh.execCommand('rsync --version');
      console.log(`${s.host}: ${res.stdout ? 'RSYNC INSTALLED' : 'NOT FOUND'}`);
      ssh.dispose();
    } catch (e) {
      console.log(`${s.host}: CONNECT FAILED`);
    }
  }
}

check();
