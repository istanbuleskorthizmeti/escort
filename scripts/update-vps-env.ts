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

    // 1. Read existing .env from remote
    console.log(' • Reading remote .env...');
    const getEnv = await ssh.execCommand('cat /var/www/escortvip/.env');
    let envContent = getEnv.stdout;

    // 2. Replace GITHUB_PAT and GITHUB_REPO_URL
    const newPatLine = `GITHUB_PAT="${process.env.GITHUB_PAT || ''}"`;
    const newRepoLine = 'GITHUB_REPO_URL="https://github.com/istanbuleskorthizmeti/eskortguvenlik"';
    
    if (envContent.includes('GITHUB_PAT=')) {
      envContent = envContent.replace(/GITHUB_PAT="[^"]*"/g, newPatLine);
      envContent = envContent.replace(/GITHUB_PAT='[^']*'/g, newPatLine);
      envContent = envContent.replace(/GITHUB_PAT=[^\n]*/g, newPatLine);
    } else {
      envContent += `\n${newPatLine}\n`;
    }

    if (envContent.includes('GITHUB_REPO_URL=')) {
      envContent = envContent.replace(/GITHUB_REPO_URL="[^"]*"/g, newRepoLine);
      envContent = envContent.replace(/GITHUB_REPO_URL='[^']*'/g, newRepoLine);
      envContent = envContent.replace(/GITHUB_REPO_URL=[^\n]*/g, newRepoLine);
    } else {
      envContent += `\n${newRepoLine}\n`;
    }

    // 3. Write back to remote .env
    console.log(' • Writing updated remote .env...');
    await ssh.execCommand(`cat << 'EOF' > /var/www/escortvip/.env\n${envContent}\nEOF`);
    console.log('   ✔ Remote .env updated.');

    // 4. Restart PM2 esc-live
    console.log('🔄 Restarting esc-live PM2 process...');
    const restartRes = await ssh.execCommand('pm2 restart esc-live');
    console.log(restartRes.stdout || restartRes.stderr);

  } catch (err: any) {
    console.error('❌ Error updating remote env:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
