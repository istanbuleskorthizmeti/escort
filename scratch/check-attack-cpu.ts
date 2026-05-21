import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('📡 SSH Connected to Attack Server (187.77.111.203).');

    // 1. Get CPU and Memory usage
    console.log('\n--- SYSTEM RESOURCE USAGE ---');
    const free = await ssh.execCommand('free -m');
    console.log(free.stdout);
    
    const load = await ssh.execCommand('uptime');
    console.log('Load Average:', load.stdout.trim());

    // 2. Get top 15 CPU consuming processes
    console.log('\n--- TOP 15 CPU PROCESSES ---');
    const topProc = await ssh.execCommand('ps -eo pid,ppid,%cpu,%mem,cmd --sort=-%cpu | head -n 15');
    console.log(topProc.stdout);

    // 3. Check PM2 status on attack server
    console.log('\n--- PM2 PROCESS LIST ---');
    const pm2Status = await ssh.execCommand('pm2 status || pm2 list');
    console.log(pm2Status.stdout || pm2Status.stderr);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ SSH Failed:', err.message);
  }
}

run();
