import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };
const dbUrl = 'postgresql://vuc2026_user:DorukElite2026Secure@localhost:5432/vuc2026?sslmode=disable';

async function distributeContent() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🛰️ Starting Global Content Distribution across 56 domains...');
    
    // 1. Get all sites
    const sitesRaw = await ssh.execCommand(`psql "${dbUrl}" -t -c "SELECT id, domain FROM \\"Site\\";"`);
    const sites = sitesRaw.stdout.split('\n').map(line => {
      const [id, domain] = line.split('|').map(s => s.trim());
      return { id, domain };
    }).filter(s => s.id && s.domain);

    console.log(`Found ${sites.length} target sites.`);

    // 2. Distribute based on domain keywords in slug
    for (const site of sites) {
       const keyword = site.domain.split('.')[0].replace('escort', '').replace('hizmeti', '').replace('vip', '');
       if (keyword.length > 3) {
          console.log(`Mapping content for keyword: ${keyword} -> ${site.domain}`);
          await ssh.execCommand(`psql "${dbUrl}" -c "UPDATE \\"PageContent\\" SET \\"siteId\\" = '${site.id}' WHERE slug LIKE '%${keyword}%' AND \\"siteId\\" = 'cmp345juw000gzwqneu6js99o';"`);
       }
    }

    console.log('✅ Content distributed to regional domains.');
    
    // 3. Clean up "Agresif" junk data
    console.log('🗑️ Purging "Agresif" junk data...');
    await ssh.execCommand(`psql "${dbUrl}" -c "DELETE FROM \\"PageContent\\" WHERE title LIKE '%Agresif%'; "`);
    console.log('✅ Junk data purged.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

distributeContent();
