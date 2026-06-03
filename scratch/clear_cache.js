const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Clearing Next.js Cache and Reloading ---');
    await ssh.execCommand('rm -rf /root/esc/.next/cache');
    console.log('Cache cleared.');
    
    await ssh.execCommand('pm2 reload all');
    console.log('PM2 Reloaded.');

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
