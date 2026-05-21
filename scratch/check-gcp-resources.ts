import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';

async function run() {
  const ssh = new NodeSSH();
  const keyPath = path.join(process.env.USERPROFILE || 'C:\\Users\\onurk', '.ssh', 'google_compute_engine');
  
  if (!fs.existsSync(keyPath)) {
    console.error(`❌ SSH Key not found at ${keyPath}`);
    return;
  }
  
  const privateKey = fs.readFileSync(keyPath, 'utf8');
  const usernames = ['onurk', 'onur', 'root'];

  for (const username of usernames) {
    try {
      console.log(`📡 Connecting to GCP Node ${username}@34.40.30.140...`);
      await ssh.connect({
        host: '34.40.30.140',
        username,
        privateKey,
        readyTimeout: 15000
      });

      console.log(`✅ SUCCESS: Connected to GCP ${username}@34.40.30.140.`);
      
      console.log('\n--- SYSTEM RESOURCE USAGE ---');
      const free = await ssh.execCommand('free -m');
      console.log(free.stdout);
      
      const cpuInfo = await ssh.execCommand('nproc && lscpu | grep "Model name"');
      console.log('CPU Info:', cpuInfo.stdout.trim());
      
      const uptime = await ssh.execCommand('uptime');
      console.log('Uptime / Load:', uptime.stdout.trim());

      console.log('\n--- PM2 PROCESS LIST ---');
      const pm2List = await ssh.execCommand('sudo pm2 status || pm2 list');
      console.log(pm2List.stdout || pm2List.stderr);

      ssh.dispose();
      return;
    } catch (err: any) {
      console.warn(`⚠️ Failed as ${username}:`, err.message);
    }
  }
}

run();
