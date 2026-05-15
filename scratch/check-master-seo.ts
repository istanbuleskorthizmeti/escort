
import { NodeSSH } from 'node-ssh';

async function check() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        const domain = 'vipescorthizmeti.com';
        console.log(`🔍 Auditing Master Domain: ${domain}`);

        // 1. Get Site ID
        const siteRes = await ssh.execCommand(`sudo -u postgres psql -d vuc2026 -t -c "SELECT id FROM \\"Site\\" WHERE domain = '${domain}';"`);
        const siteId = siteRes.stdout.trim();
        
        if (!siteId) {
            console.log(`❌ Site not found for domain: ${domain}`);
            ssh.dispose();
            return;
        }
        console.log(`✅ Site ID Found: ${siteId}`);

        // 2. Count PageContent for this site
        const contentRes = await ssh.execCommand(`sudo -u postgres psql -d vuc2026 -t -c "SELECT count(*) FROM \\"PageContent\\" WHERE \\"siteId\\" = '${siteId}';"`);
        console.log(`📊 Total PageContent entries for this site: ${contentRes.stdout.trim()}`);

        // 3. Sample content
        const sampleRes = await ssh.execCommand(`sudo -u postgres psql -d vuc2026 -c "SELECT slug, title FROM \\"PageContent\\" WHERE \\"siteId\\" = '${siteId}' LIMIT 10;"`);
        console.log(`📝 Sample Content:\n${sampleRes.stdout}`);

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

check();
