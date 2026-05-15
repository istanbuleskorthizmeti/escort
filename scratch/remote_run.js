const { NodeSSH } = require('node-ssh');

async function run() {
  const sshList = [new NodeSSH(), new NodeSSH(), new NodeSSH()];
  const servers = [
    { host: '187.77.111.203', pass: 'Z4-nN8JfiUIh5,;g', path: '/var/www/escortvip', role: 'ATTACK' },
    { host: '45.93.137.164', pass: 'Z4-nN8JfiUIh5,;g', path: '/var/www/escortvip', role: 'ATTACK' },
    { host: '213.232.235.181', pass: '4TVuj7qiHMfh7CxH6K!', path: '/root/hydra', role: 'MAIN' }
  ];

  const tasks = servers.map(async (server, index) => {
    const ssh = sshList[index];
    try {
      console.log(`Connecting to ${server.host}...`);
      await ssh.connect({
        host: server.host,
        username: 'root',
        password: server.pass
      });

      console.log(`[${server.host}] Connected. Resetting Prisma version to 5.22.0...`);
      // Fix for the Schema 7.8.0 vs 5.22.0 incompatibility on remote servers
      await ssh.execCommand(`cd ${server.path} && npm install @prisma/client@5.22.0 prisma@5.22.0`);
      
      if (server.role === 'MAIN') {
         console.log(`[${server.host}] Generating Prisma, Building and Restarting PM2...`);
         ssh.execCommand(`cd ${server.path} && npx prisma generate && rm -rf .next && npm run build && pm2 restart all`, {
            onStdout: (chunk) => console.log(`[${server.host}] ${chunk.toString('utf8')}`),
            onStderr: (chunk) => console.error(`[${server.host}] ${chunk.toString('utf8')}`)
         });
         
         // Give it a little time to start building before launching the conqueror
         setTimeout(() => {
            console.log(`[${server.host}] Starting Hydra Conqueror...`);
            ssh.execCommand(`cd ${server.path} && npx tsx scripts/hydra-conqueror.ts`, {
                onStdout: (chunk) => console.log(`[${server.host}] [CONQUEROR] ${chunk.toString('utf8')}`)
            });
         }, 5000);

      } else {
         console.log(`[${server.host}] Triggering Swarm Attack...`);
         ssh.execCommand(`cd ${server.path} && npx tsx scripts/god-mode-swarm.ts`, {
            onStdout: (chunk) => console.log(`[${server.host}] [SWARM] ${chunk.toString('utf8')}`),
            onStderr: (chunk) => console.error(`[${server.host}] [SWARM-ERR] ${chunk.toString('utf8')}`)
         });
      }

    } catch (e) {
      console.error(`[${server.host}] Error:`, e.message);
    } 
    // Intentionally leaving connections open so background tasks can run
  });

  await Promise.all(tasks);
  console.log('🏁 Remote execution triggered successfully.');
}

run().catch(console.error);
