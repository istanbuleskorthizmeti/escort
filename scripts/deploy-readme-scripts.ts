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
    console.log(' • Syncing scripts/generate-dorukcanay-readme.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\generate-dorukcanay-readme.ts', '/var/www/escortvip/scripts/generate-dorukcanay-readme.ts');
    
    console.log(' • Syncing scripts/sync-readme-docs.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\sync-readme-docs.ts', '/var/www/escortvip/scripts/sync-readme-docs.ts');

    console.log(' • Syncing scripts/sync-readme-github.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\sync-readme-github.ts', '/var/www/escortvip/scripts/sync-readme-github.ts');

    console.log(' • Syncing scripts/indexnow-readme.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\indexnow-readme.ts', '/var/www/escortvip/scripts/indexnow-readme.ts');
    console.log('   ✔ Synced successfully.');

  } catch (err: any) {
    console.error('❌ Error during sync:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
