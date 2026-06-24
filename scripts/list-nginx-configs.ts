import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  port: 22,
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('📡 Listing nginx sites-enabled:');
    const listRes = await ssh.execCommand('ls -la /etc/nginx/sites-enabled/');
    console.log(listRes.stdout);

    console.log('📡 Cat-ing all configs in sites-enabled:');
    const catRes = await ssh.execCommand('tail -n 100 /etc/nginx/sites-enabled/*');
    console.log(catRes.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
