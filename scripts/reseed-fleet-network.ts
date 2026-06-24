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
    console.log(' • Syncing updated scripts/generate-encyclopedia-fleet.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\generate-encyclopedia-fleet.ts', '/var/www/escortvip/scripts/generate-encyclopedia-fleet.ts');
    
    console.log(' • Syncing updated scripts/encyclopedia-templates.ts to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\scripts\\encyclopedia-templates.ts', '/var/www/escortvip/scripts/encyclopedia-templates.ts');
    console.log('   ✔ Synced.');

    // 2. Clean old encyclopedia database rows to force re-generation with new backlinks
    console.log('🧹 Clearing old encyclopedia entries in database to force refresh...');
    const clearDb = await ssh.execCommand('npx prisma db execute --stdin <<EOF\nDELETE FROM "PageContent" WHERE slug LIKE \'ansiklopedi-%\';\nEOF', { cwd: '/var/www/escortvip' });
    console.log('DB Clear Output:', clearDb.stdout || clearDb.stderr);

    // 3. Run the fleet seeder to generate all 1100 articles with new links
    console.log('🚀 Launching fleet-wide unique encyclopedia seeder...');
    const seedRes = await ssh.execCommand('npx tsx scripts/generate-encyclopedia-fleet.ts', { cwd: '/var/www/escortvip' });
    console.log('=== SEEDER OUTPUT ===');
    console.log(seedRes.stdout);
    if (seedRes.stderr) {
      console.warn('Seeder Warning/Error:', seedRes.stderr);
    }

    // 4. Run the rank-boost indexing ping
    console.log('📡 Pinging indexers for updated sitemaps and key pages...');
    const pingRes = await ssh.execCommand('npx tsx -e "\n      const { googleIndexing } = require(\'./lib/google-indexing\');\n      async function main() {\n        console.log(\'🛰️ Broadcasting indexing signals...\');\n        await googleIndexing.broadcast(\'https://dorukcanay.digital\');\n        await googleIndexing.broadcast(\'https://dorukcanay.digital/sitemap.xml\');\n        console.log(\'✔ Done.\');\n      }\n      main();\n    "', { cwd: '/var/www/escortvip' });
    console.log(pingRes.stdout || pingRes.stderr);

  } catch (err: any) {
    console.error('❌ Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

run();
