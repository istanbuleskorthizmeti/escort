import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function checkEscortVip() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('📂 Inspecting /var/www/escortvip/ ...');
    
    const ls = await ssh.execCommand('ls -la /var/www/escortvip/');
    console.log(ls.stdout);
    
    const next = await ssh.execCommand('ls -la /var/www/escortvip/.next').catch(() => ({stdout: 'NO .next'}));
    console.log('.next Contents:', next.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

checkEscortVip();
