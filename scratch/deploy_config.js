const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected to server.');

    // 1. Read local config/site.ts
    const localConfigPath = path.resolve(__dirname, '../config/site.ts');
    const localConfigContent = fs.readFileSync(localConfigPath, 'utf8');

    // 2. Write it to server using cat block
    const remoteConfigPath = '/var/www/escortvip/config/site.ts';
    console.log('Writing config/site.ts to server...');
    
    // Write using cat EOF
    const escapedContent = localConfigContent.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    const writeResult = await ssh.execCommand(`cat << 'EOF' > ${remoteConfigPath}\n${localConfigContent}\nEOF`);
    
    if (writeResult.stderr) {
      console.error('Error writing config:', writeResult.stderr);
    } else {
      console.log('config/site.ts successfully written to server.');
    }

    // 3. Trigger build on server
    console.log('Triggering production build on server...');
    const buildResult = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('Build Output:\n', buildResult.stdout || buildResult.stderr);

    if (buildResult.code === 0) {
      console.log('Build succeeded! Reloading PM2...');
      const reloadResult = await ssh.execCommand('pm2 reload escortvip', { cwd: '/var/www/escortvip' });
      console.log('PM2 Reload Output:\n', reloadResult.stdout || reloadResult.stderr);
    } else {
      console.error('Build failed! Reload aborted.');
    }

    ssh.dispose();
  } catch (err) {
    console.error('Error during config deploy:', err);
    ssh.dispose();
  }
})();
