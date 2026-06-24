import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    console.log('🔐 Connecting to the production VPS...');
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    // 1. Sync updated files to the server
    console.log(' • Syncing scripts/broadcast-all-pbn.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\broadcast-all-pbn.ts', '/var/www/escortvip/scripts/broadcast-all-pbn.ts');
    console.log('   ✔ Synced.');

    // 2. Run the broadcasting script
    console.log('🚀 Running indexing broadcast across all PBN sites...');
    const broadcastRes = await ssh.execCommand('npx tsx scripts/broadcast-all-pbn.ts', { cwd: '/var/www/escortvip' });
    console.log('=== BROADCAST OUTPUT ===');
    console.log(broadcastRes.stdout || broadcastRes.stderr);

  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
