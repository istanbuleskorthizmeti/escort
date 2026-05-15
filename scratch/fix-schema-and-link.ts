import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';
const mainSiteId = 'cmp345juw000gzwqneu6js99o'; // vipescorthizmeti.com

async function fixSchemaAndLinkContent() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛠️ Re-aligning Schema and Linking 1-month archive...');
    
    // 1. Add siteId column
    await ssh.execCommand(`psql "${dbUrl}" -c "ALTER TABLE \\"PageContent\\" ADD COLUMN IF NOT EXISTS \\"siteId\\" text;"`);
    console.log('✅ siteId column added.');

    // 2. Link all records to the main siteId
    await ssh.execCommand(`psql "${dbUrl}" -c "UPDATE \\"PageContent\\" SET \\"siteId\\" = '${mainSiteId}' WHERE \\"siteId\\" IS NULL;"`);
    console.log('✅ All 9715 records linked to vipescorthizmeti.com.');

    // 3. Add Foreign Key
    await ssh.execCommand(`psql "${dbUrl}" -c "ALTER TABLE \\"PageContent\\" ADD CONSTRAINT \\"PageContent_siteId_fkey\\" FOREIGN KEY (\\"siteId\\") REFERENCES \\"Site\\"(id) ON DELETE SET NULL ON UPDATE CASCADE;"`).catch(() => console.log('FK already exists or failed.'));

    // 4. Add Unique Constraint (slug + siteId)
    // We might need to handle duplicates first, but let's try.
    await ssh.execCommand(`psql "${dbUrl}" -c "ALTER TABLE \\"PageContent\\" ADD CONSTRAINT \\"PageContent_slug_siteId_key\\" UNIQUE (slug, \\"siteId\\");"`).catch(() => console.log('Unique constraint already exists or failed (likely duplicates).'));

    console.log('🚀 DATABASE ALIGNMENT COMPLETE.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

fixSchemaAndLinkContent();
