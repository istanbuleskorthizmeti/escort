import { NodeSSH } from 'node-ssh';

const hosts = [
  { host: '45.93.137.164', pass: 'Z4-nN8JfiUIh5,;g' },
  { host: '213.232.235.181', pass: '4TVuj7qiHMfh7CxH6K!' }
];

async function checkSize() {
  for (const item of hosts) {
    const ssh = new NodeSSH();
    try {
      await ssh.connect({ host: item.host, username: 'root', password: item.pass });
      const res = await ssh.execCommand('ls -lh /root/hydra_transfer.tar.gz');
      console.log(`[${item.host}] Size:`, res.stdout);
      ssh.dispose();
    } catch (e: any) {
      console.log(`[${item.host}] Error:`, e.message);
    }
  }
}

checkSize();
