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
    console.log('✅ Connected.');
    
    console.log('📡 NGINX SITES-ENABLED:');
    const sites = await ssh.execCommand('ls -la /etc/nginx/sites-enabled/');
    console.log(sites.stdout || sites.stderr);

    console.log('📡 CAT ACTIVE CONFIG:');
    const catConf = await ssh.execCommand('cat /etc/nginx/sites-enabled/*');
    console.log(catConf.stdout || catConf.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
