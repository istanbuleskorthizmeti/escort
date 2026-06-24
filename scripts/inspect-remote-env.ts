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
    console.log('✅ Connected to VPS.');

    const catRes = await ssh.execCommand('grep -E "PROXY|FORCE" /root/esc/.env');
    console.log('📋 [VPS ENV PROXIES]:');
    console.log(catRes.stdout || catRes.stderr || 'No matches found.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error reading remote env:', err.message);
    ssh.dispose();
  }
}

run();
