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

    const catRes = await ssh.execCommand('tail -n 40 /root/esc/logs/traffic-blitz.log');
    console.log('📋 [VPS LOGS] Last 40 lines of traffic-blitz.log:');
    console.log(catRes.stdout || catRes.stderr || 'No log content found yet.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error reading logs:', err.message);
    ssh.dispose();
  }
}

run();
