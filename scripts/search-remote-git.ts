import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    console.log('🔐 Connecting to the production VPS...');
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    console.log('--- FIND GIT REPOS ON VPS ---');
    const findGit = await ssh.execCommand('find /var/www -name ".git" -type d');
    console.log(findGit.stdout);

    // List files in /var/www
    const lsVarWww = await ssh.execCommand('ls -la /var/www');
    console.log('\n--- /var/www directory listing ---');
    console.log(lsVarWww.stdout);

  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
