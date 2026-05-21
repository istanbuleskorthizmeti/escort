import { NodeSSH } from 'node-ssh';

async function run() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    console.log('📡 Connected to 187.77.111.203.');
    
    // Stop heavily consuming/duplicate background processes
    console.log('🛑 Stopping resource-hungry background tasks on Attack Server...');
    await ssh.execCommand('pm2 stop ctr-warrior || true');
    await ssh.execCommand('pm2 stop elite-blogger-autopilot || true');
    await ssh.execCommand('pm2 stop elite-bot || true');
    
    // Kill stray/duplicate node processes to free resources
    console.log('💀 Killing duplicate stray node processes...');
    await ssh.execCommand('pkill -f ctr-warrior || true');
    await ssh.execCommand('pkill -f tsx || true');

    // Check system resources again
    console.log('\n📊 NEW LOAD STATE:');
    const load = await ssh.execCommand('uptime');
    console.log(load.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ Error during optimization:', err.message);
  }
}

run();
