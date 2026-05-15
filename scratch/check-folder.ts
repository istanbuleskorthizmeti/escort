import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkFolder() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Checking /root/hydra/public/_media/vitrin ...');
    
    const res = await ssh.execCommand('ls -R /root/hydra/public/_media/vitrin');
    console.log(res.stdout || 'FOLDER IS EMPTY');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkFolder();
