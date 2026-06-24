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

    // Sync updated scripts/generate-dorukcanay-readme.ts to the server
    console.log(' • Syncing scripts/generate-dorukcanay-readme.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\generate-dorukcanay-readme.ts', '/var/www/escortvip/scripts/generate-dorukcanay-readme.ts');
    console.log('   ✔ Synced.');

  } catch (err: any) {
    console.error('❌ Error during script update:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
