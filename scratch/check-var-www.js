const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkVarWww() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
    console.log('Connected.');

    console.log('📂 Listing /var/www/esc:');
    const list = await ssh.execCommand('ls -la /var/www/esc');
    console.log(list.stdout || '/var/www/esc is empty or missing');

  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}

checkVarWww();
