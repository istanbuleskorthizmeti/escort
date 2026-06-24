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
    console.log('✅ Connected to 31.97.79.34.');

    const catRes = await ssh.execCommand('cat /root/esc/.env');
    console.log('\n--- VPS .ENV ---');
    console.log(catRes.stdout || catRes.stderr || 'No content');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
