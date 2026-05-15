const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fixNginx() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    const filePath = '/etc/nginx/sites-enabled/hydra';
    console.log(`Reading ${filePath}...`);
    const content = await ssh.execCommand(`cat ${filePath}`);
    let nginxConfig = content.stdout;

    console.log('Original Config (first 10 lines):');
    console.log(nginxConfig.split('\n').slice(0, 10).join('\n'));

    // Fix duplicate gzip
    // The error said "duplicate in /etc/nginx/sites-enabled/hydra:2"
    const lines = nginxConfig.split('\n');
    if (lines[1].includes('gzip')) {
      console.log('Removing duplicate gzip on line 2...');
      lines.splice(1, 1);
    }

    const newConfig = lines.join('\n');
    
    // Write back
    await ssh.execCommand(`echo '${newConfig.replace(/'/g, "'\\''")}' > ${filePath}`);
    
    console.log('Verifying config...');
    const verify = await ssh.execCommand('nginx -t');
    console.log(verify.stderr || verify.stdout);

    if (verify.stdout.includes('successful') || verify.stderr.includes('successful')) {
      console.log('Success! Reloading nginx...');
      await ssh.execCommand('systemctl reload nginx');
    } else {
      console.error('Nginx test still failing!');
    }

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

fixNginx();
