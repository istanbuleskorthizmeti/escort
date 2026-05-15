
import { NodeSSH } from 'node-ssh';

async function list() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log('🌐 Fetching Sites from Database via Temp File...');
        await ssh.execCommand('sudo -u postgres psql -d vuc2026 -c "SELECT domain FROM \\"Site\\" WHERE status = \'ACTIVE\' ORDER BY domain ASC;" > /tmp/sites_list.txt');
        const res = await ssh.execCommand('cat /tmp/sites_list.txt');
        console.log(res.stdout);

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

list();
