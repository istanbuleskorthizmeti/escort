import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function listSubfolders() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Listing ALL subfolders in /var/www/escortvip ...');
    
    const res = await ssh.execCommand('find /var/www/escortvip -maxdepth 6 -type d -not -path "*/node_modules/*"');
    console.log(res.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

listSubfolders();
