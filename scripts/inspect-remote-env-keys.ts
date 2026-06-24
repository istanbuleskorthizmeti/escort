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

    const res = await ssh.execCommand('cat /root/esc/.env');
    const lines = res.stdout.split('\n');
    console.log('--- REMOTE ENV KEYS ---');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#')) {
        const parts = line.split('=');
        console.log(parts[0]);
      }
    }
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
