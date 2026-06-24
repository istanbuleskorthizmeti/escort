import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🔍 Listing /etc/nginx/sites-enabled/ contents:');
    const files = await ssh.execCommand('ls -l /etc/nginx/sites-enabled/');
    console.log(files.stdout);

    console.log('🔍 Searching for escortvip.net in Nginx config files:');
    const searchRes = await ssh.execCommand('grep -rn "escortvip.net" /etc/nginx/');
    console.log(searchRes.stdout || 'Not found in /etc/nginx/');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
