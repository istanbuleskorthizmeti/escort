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

    console.log('--- FINDING ALL GIT REPOS ON VPS ---');
    const findGit = await ssh.execCommand('find / -name ".git" -type d -not -path "/proc/*" -not -path "/sys/*" -not -path "/dev/*" -not -path "/var/lib/*" -not -path "/snap/*" 2>/dev/null');
    console.log(findGit.stdout);

  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
