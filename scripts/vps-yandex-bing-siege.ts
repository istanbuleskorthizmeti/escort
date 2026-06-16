import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  port: 22,
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('🔐 Connecting to VPS...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🚀 Executing yandex-bing-aggressive-siege.ts on the VPS using the local database context...');
    const result = await ssh.execCommand(
      'DATABASE_URL=postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable npx tsx scripts/yandex-bing-aggressive-siege.ts',
      { cwd: '/root/esc' }
    );

    console.log('📋 [VPS OUTPUT]:');
    console.log(result.stdout || result.stderr || 'No output returned.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 VPS aggressive Yandex/Bing indexing trigger failed:', err.message);
    ssh.dispose();
  }
}

run();
