import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected to VPS.');

    console.log('🧹 Purging /var/cache/nginx/ cache directory...');
    const purgeRes = await ssh.execCommand('rm -rf /var/cache/nginx/*');
    console.log('Purge Command Output:', purgeRes.stdout || purgeRes.stderr || 'Success');

    console.log('🔄 Restarting Nginx server...');
    const restartRes = await ssh.execCommand('systemctl restart nginx');
    console.log('Nginx Restart Output:', restartRes.stdout || restartRes.stderr || 'Success');

    console.log('🔍 Checking Nginx status...');
    const statusRes = await ssh.execCommand('systemctl status nginx | head -n 15');
    console.log(statusRes.stdout || statusRes.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
