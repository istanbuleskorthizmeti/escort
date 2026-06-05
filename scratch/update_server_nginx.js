const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('Connected to server.');

    // Read the Nginx file first to verify content
    const catResult = await ssh.execCommand('cat /etc/nginx/sites-available/sovereign-hydra.conf');
    let conf = catResult.stdout;

    if (!conf) {
      console.error('Failed to read config, output is empty.');
      ssh.dispose();
      process.exit(1);
    }

    // Comment out the X-Frame-Options line if present and not commented
    const target = 'add_header X-Frame-Options "SAMEORIGIN" always;';
    if (conf.includes(target)) {
      console.log('Target X-Frame-Options found. Commenting out...');
      conf = conf.replace(target, '# add_header X-Frame-Options "SAMEORIGIN" always;');
      
      // Write it back to the server
      const tempPath = '/tmp/sovereign-hydra.conf.tmp';
      await ssh.execCommand(`cat << 'EOF' > ${tempPath}\n${conf}\nEOF`);
      
      // Move to correct place
      await ssh.execCommand(`mv ${tempPath} /etc/nginx/sites-available/sovereign-hydra.conf`);
      console.log('Config updated.');
    } else {
      console.log('X-Frame-Options not found or already commented out.');
    }

    // Test Nginx
    const testResult = await ssh.execCommand('nginx -t');
    console.log('Nginx Test Output:\n', testResult.stdout || testResult.stderr);

    if (testResult.stderr.includes('syntax is ok') || testResult.stdout.includes('syntax is ok')) {
      const reloadResult = await ssh.execCommand('systemctl reload nginx');
      console.log('Nginx Reload Output:\n', reloadResult.stdout || reloadResult.stderr || 'Success');
    } else {
      console.error('Nginx syntax is invalid. Reload skipped.');
    }

    ssh.dispose();
  } catch (error) {
    console.error('Error:', error);
    ssh.dispose();
  }
})();
