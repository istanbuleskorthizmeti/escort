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

    const catRes = await ssh.execCommand('cat /etc/nginx/sites-available/sovereign-hydra.conf');
    console.log('📋 [VPS NGINX CONFIG]:');
    console.log(catRes.stdout || catRes.stderr);

    ssh.dispose();
  } catch (err: unknown) {
    console.error('💥 Error:', err instanceof Error ? err.message : String(err));
    ssh.dispose();
  }
}

run();
