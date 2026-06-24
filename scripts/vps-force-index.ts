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
    console.log('🔐 Connecting to VPS...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('🚀 Executing force_index_sites.ts on the VPS using the local database context...');
    const result = await ssh.execCommand(
      'DATABASE_URL=postgresql://vuc2026_user:vuc2026_pass@localhost:5432/vuc2026?sslmode=disable npx tsx scripts/force_index_sites.ts',
      { cwd: '/root/esc' }
    );

    console.log('📋 [VPS OUTPUT]:');
    console.log(result.stdout || result.stderr || 'No output returned.');

    ssh.dispose();
  } catch (err: any) {
    console.error('💥 VPS force index trigger failed:', err.message);
    ssh.dispose();
  }
}

run();
