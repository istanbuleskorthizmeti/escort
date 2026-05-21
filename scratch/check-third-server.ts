import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '45.93.137.164',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('📡 Connected to third server (45.93.137.164).');
    
    console.log('\n--- UPTIME / LOAD ---');
    const uptime = await ssh.execCommand('uptime');
    console.log(uptime.stdout);

    console.log('\n--- PM2 PROCESS LIST ---');
    const pm2List = await ssh.execCommand('pm2 status || pm2 list');
    console.log(pm2List.stdout || pm2List.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Connection Failed to 45.93.137.164:', err.message);
  }
}

run();
