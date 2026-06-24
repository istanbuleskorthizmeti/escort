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

    console.log('📡 Running Yandex/Bing aggressive indexer script on VPS...');
    const res = await ssh.execCommand('npx tsx scripts/yandex-bing-aggressive-siege.ts', { cwd: '/root/esc' });
    console.log('Output:\n', res.stdout || res.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
