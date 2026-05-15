import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function hardReset() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🧹 Hard resetting Escort Server...');
    
    // Kill everything node
    await ssh.execCommand('pkill -9 node || true');
    await ssh.execCommand('pkill -9 next || true');
    
    const free = await ssh.execCommand('free -m');
    console.log('--- MEMORY ---');
    console.log(free.stdout);
    
    const cpu = await ssh.execCommand('uptime');
    console.log('--- UPTIME/CPU ---');
    console.log(cpu.stdout);

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

hardReset();
