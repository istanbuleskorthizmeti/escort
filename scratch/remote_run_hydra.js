const { NodeSSH } = require('node-ssh');

async function run() {
  const ssh = new NodeSSH();
  const server = { host: '213.232.235.181', pass: '4TVuj7qiHMfh7CxH6K!', path: '/root/hydra', role: 'MAIN' };

  try {
    console.log(`Connecting to ${server.host}...`);
    await ssh.connect({
      host: server.host,
      username: 'root',
      password: server.pass
    });

    console.log(`[${server.host}] Connected.`);
    
    console.log(`[${server.host}] Starting Hydra Conqueror via PM2...`);
    // Run via PM2 so it stays in the background and we don't have to keep the SSH connection open
    const res = await ssh.execCommand(`cd ${server.path} && pm2 start scripts/hydra-conqueror.ts --name hydra-conqueror --interpreter ./node_modules/.bin/tsx`, {
      onStdout: (chunk) => console.log(`[${server.host}] ${chunk.toString('utf8')}`),
      onStderr: (chunk) => console.error(`[${server.host}] ${chunk.toString('utf8')}`)
    });
    
    // Also restart the other PM2 services
    await ssh.execCommand(`pm2 start all`);
    await ssh.execCommand(`pm2 save`);

  } catch (e) {
    console.error(`[${server.host}] Error:`, e.message);
  } finally {
      ssh.dispose();
  }

  console.log('🏁 Remote execution triggered successfully.');
}

run().catch(console.error);
