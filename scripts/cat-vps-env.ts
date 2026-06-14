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
    console.log('✅ Connected to 187.77.111.203.');

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
