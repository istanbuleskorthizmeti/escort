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
