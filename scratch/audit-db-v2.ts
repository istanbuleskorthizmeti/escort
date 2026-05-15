
import { NodeSSH } from 'node-ssh';

async function audit() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log('🕵️‍♂️ Auditing DB Tables (vuc2026)...');
        // Get table names
        const tablesRes = await ssh.execCommand('sudo -u postgres psql -d vuc2026 -t -c "\\dt"');
        
        const tables = tablesRes.stdout.split('\n')
            .map(line => line.split('|')[1]?.trim())
            .filter(Boolean);

        if (tables.length === 0) {
            console.log('⚠️ No tables found in vuc2026.');
            console.log('Full Output:', tablesRes.stdout);
        }

        for (const table of tables) {
            const countRes = await ssh.execCommand(`sudo -u postgres psql -d vuc2026 -t -c "SELECT count(*) FROM \\"${table}\\";"`);
            console.log(`Table: ${table.padEnd(20)} | Count: ${countRes.stdout.trim()}`);
        }

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

audit();
