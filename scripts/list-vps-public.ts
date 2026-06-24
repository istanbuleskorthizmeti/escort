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

    console.log('🔍 Listing files in /root/esc/public:');
    const res = await ssh.execCommand('ls -la /root/esc/public/');
    console.log(res.stdout);

    ssh.dispose();
  } catch (err: unknown) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
    ssh.dispose();
  }
}

run();
