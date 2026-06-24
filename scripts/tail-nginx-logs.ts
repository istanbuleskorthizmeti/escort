import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('--- NGINX ACCESS LOGS ---');
    const access = await ssh.execCommand('tail -n 30 /var/log/nginx/access.log');
    console.log(access.stdout || 'No access logs');

    console.log('--- NGINX ERROR LOGS ---');
    const error = await ssh.execCommand('tail -n 30 /var/log/nginx/error.log');
    console.log(error.stdout || 'No error logs');

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
