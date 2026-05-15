
import { NodeSSH } from 'node-ssh';

async function audit() {
    const ssh = new NodeSSH();
    try {
        await ssh.connect({
            host: '213.232.235.181',
            username: 'root',
            password: '4TVuj7qiHMfh7CxH6K!'
        });

        console.log('🕵️‍♂️ Auditing DB Tables...');
        const tablesRes = await ssh.execCommand('psql -d vuc2026 -U vuc2026_user -t -c "\\dt"', {
            env: { PGPASSWORD: 'DorukElite2026Secure' }
        });
        
        const tables = tablesRes.stdout.split('\n')
            .map(line => line.split('|')[1]?.trim())
            .filter(Boolean);

        for (const table of tables) {
            const countRes = await ssh.execCommand(`psql -d vuc2026 -U vuc2026_user -t -c "SELECT count(*) FROM \\"${table}\\";"`, {
                env: { PGPASSWORD: 'DorukElite2026Secure' }
            });
            console.log(`Table: ${table.padEnd(20)} | Count: ${countRes.stdout.trim()}`);
        }

        ssh.dispose();
    } catch (err) {
        console.error('❌ Error:', err);
    }
}

audit();
