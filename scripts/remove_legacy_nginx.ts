import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to server.');

    // 1. Remove legacy conflicting symlink
    console.log('🗑️ Removing legacy conflicting Nginx symlink /etc/nginx/sites-enabled/hydra...');
    await ssh.execCommand('rm -f /etc/nginx/sites-enabled/hydra');
    console.log('✅ Symlink removed.');

    // 2. Test Nginx Configuration
    console.log('🔍 Testing Nginx Configuration...');
    const testRes = await ssh.execCommand('nginx -t');
    console.log(testRes.stdout || testRes.stderr);

    if (testRes.stderr && testRes.stderr.includes('emerg')) {
      console.error('❌ Nginx config test failed! Rolling back...');
      ssh.dispose();
      return;
    }

    // 3. Reload Nginx
    console.log('🔄 Reloading Nginx server...');
    const reloadRes = await ssh.execCommand('systemctl reload nginx');
    console.log('✅ Nginx reload completed.', reloadRes.stdout || reloadRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Error:', err);
    ssh.dispose();
  }
}

run();
