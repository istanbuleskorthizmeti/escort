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
    console.log('✅ Connected to VPS.');

    console.log('\n--- /etc/nginx/nginx.conf ---');
    const nginxConf = await ssh.execCommand('cat /etc/nginx/nginx.conf');
    console.log(nginxConf.stdout || nginxConf.stderr);

    console.log('\n--- Checking disk space and cache dir permissions ---');
    const df = await ssh.execCommand('df -h && ls -ld /var/cache/nginx');
    console.log(df.stdout || df.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('Error:', err.message);
    ssh.dispose();
  }
}

run();
