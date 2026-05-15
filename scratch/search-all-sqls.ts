import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function searchAllSqlFiles() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🕵️ Scanning all SQL files for AdProfile data...');
    
    const files = await ssh.execCommand('ls /var/www/escortvip/*.sql');
    const sqlFiles = files.stdout.split('\n').filter(f => f.trim());

    for (const file of sqlFiles) {
      const count = await ssh.execCommand(`grep -c "INSERT INTO \\"AdProfile\\"" ${file} || grep -c "COPY public.\\"AdProfile\\"" ${file}`);
      console.log(`File: ${file} | AdProfile match count: ${count.stdout.trim()}`);
      
      // If it's a COPY command, check if it has data lines
      if (count.stdout.trim() !== '0') {
         const peek = await ssh.execCommand(`grep -A 5 "COPY public.\\"AdProfile\\"" ${file} | tail -n 3`);
         console.log(`Peek: ${peek.stdout}`);
      }
    }

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

searchAllSqlFiles();
