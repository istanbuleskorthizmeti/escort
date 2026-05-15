
import { NodeSSH } from 'node-ssh';

async function check() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log('📊 Querying Database for SEO Content...');
        
        const countRes = await ssh.execCommand('psql -d vuc2026 -U vuc2026_user -t -c "SELECT count(*) FROM \\"PageContent\\";"', {
            env: { PGPASSWORD: 'DorukElite2026Secure' }
        });
        console.log('Total SEO Pages:', countRes.stdout.trim());

        const sampleRes = await ssh.execCommand('psql -d vuc2026 -U vuc2026_user -c "SELECT slug, title FROM \\"PageContent\\" LIMIT 10;"', {
            env: { PGPASSWORD: 'DorukElite2026Secure' }
        });
        console.log('Sample Content:\n', sampleRes.stdout);

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

check();
