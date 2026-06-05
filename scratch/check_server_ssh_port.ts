import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    console.log('📡 Connecting to SSH (port 22)...');
    await ssh.connect({ ...config, port: 22 });
    console.log('✅ Connected.');

    console.log('\n--- Uptime & Load ---');
    const uptime = await ssh.execCommand('uptime');
    console.log(uptime.stdout);

    console.log('\n--- PM2 Status ---');
    const pm2List = await ssh.execCommand('pm2 list');
    console.log(pm2List.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Port 22 failed:', err instanceof Error ? err.message : err);
    try {
      console.log('📡 Retrying connection on port 2222...');
      await ssh.connect({ ...config, port: 2222 });
      console.log('✅ Connected on port 2222.');

      console.log('\n--- Uptime & Load ---');
      const uptime = await ssh.execCommand('uptime');
      console.log(uptime.stdout);

      console.log('\n--- PM2 Status ---');
      const pm2List = await ssh.execCommand('pm2 list');
      console.log(pm2List.stdout);

      ssh.dispose();
    } catch (err2) {
      console.error('💥 Port 2222 failed too:', err2 instanceof Error ? err2.message : err2);
      ssh.dispose();
    }
  }
}

run();
