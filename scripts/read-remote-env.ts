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

    console.log('--- REMOTE .ENV CONTENT (/var/www/escortvip/.env) ---');
    const getEnv = await ssh.execCommand('cat /var/www/escortvip/.env');
    console.log(getEnv.stdout);
    
    console.log('\n--- REMOTE GIT CONFIGS ---');
    const getGitConfig = await ssh.execCommand('git config --global --list');
    console.log(getGitConfig.stdout);

    console.log('\n--- REMOTE SSH KEYS ---');
    const getSshKeys = await ssh.execCommand('ls -la ~/.ssh');
    console.log(getSshKeys.stdout);

  } catch (err: any) {
    console.error('❌ Error reading remote env:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
