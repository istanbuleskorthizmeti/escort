import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    const gitStatus = await ssh.execCommand('git status', { cwd: '/var/www/escortvip' });
    console.log('--- GIT STATUS ON VPS ---');
    console.log(gitStatus.stdout || gitStatus.stderr);

    const gitDiff = await ssh.execCommand('git diff --stat', { cwd: '/var/www/escortvip' });
    console.log('--- GIT DIFF ON VPS ---');
    console.log(gitDiff.stdout || gitDiff.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
