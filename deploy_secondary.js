const { NodeSSH } = require('node-ssh');
const fs = require('fs');

const servers = [
    { host: '187.77.111.203', username: 'root', password: 'Z4-nN8JfiUIh5,;g' },
    { host: '45.93.137.164', username: 'root', password: 'Z4-nN8JfiUIh5,;g' }
];

async function deployToAll() {
    for (const server of servers) {
        console.log(`\n\n[DEPLOY] Starting deployment to ${server.host}...`);
        const ssh = new NodeSSH();
        try {
            await ssh.connect(server);
            console.log(`[${server.host}] Connected successfully.`);

            // Ensure hydra directory exists
            await ssh.execCommand('mkdir -p /root/hydra/scripts', { cwd: '/root' });
            await ssh.execCommand('mkdir -p /root/hydra/lib/seo/spam-engines', { cwd: '/root' });

            console.log(`[${server.host}] Uploading payload scripts...`);
            
            // Assuming local files are available
            await ssh.putFile('scratch_elite-backlog-attack.ts', '/root/hydra/scripts/elite-backlog-attack.ts');
            await ssh.putFile('lib/seo/spam-engines/rentry.ts', '/root/hydra/lib/seo/spam-engines/rentry.ts');
            await ssh.putFile('lib/ai-seo.ts', '/root/hydra/lib/ai-seo.ts');

            console.log(`[${server.host}] Scripts uploaded. Restarting PM2...`);
            const pm2Result = await ssh.execCommand('pm2 restart hydra-watchdog || pm2 start npx --name "hydra-watchdog" -- tsx scripts/elite-backlog-attack.ts', { cwd: '/root/hydra' });
            console.log(`[${server.host}] PM2 Status:`, pm2Result.stdout);
            
            console.log(`[${server.host}] Deployment finished.`);
        } catch (e) {
            console.error(`[${server.host}] Error:`, e.message);
        } finally {
            ssh.dispose();
        }
    }
}

deployToAll();
