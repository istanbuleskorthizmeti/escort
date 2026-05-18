import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

const scriptCode = `
const fs = require('fs');
const path = require('path');

function nativeKill() {
  console.log('🚨 [NATIVE KILLER] Initiating kernel-level process sweep...');
  const files = fs.readdirSync('/proc');
  let killCount = 0;

  for (const file of files) {
    if (!/^\\d+$/.test(file)) continue;
    const pid = parseInt(file, 10);
    if (pid === process.pid) continue; // Don't kill ourselves
    
    try {
      const statusContent = fs.readFileSync(path.join('/proc', file, 'status'), 'utf8');
      const nameMatch = statusContent.match(/^Name:\\s+(.+)$/m);
      if (!nameMatch) continue;
      
      const name = nameMatch[1];
      if (name.includes('next-server') || name.includes('node') || name.includes('chrome') || name.includes('chromium')) {
        console.log(\`⚡ Killing PID \${pid} (\${name})...\`);
        process.kill(pid, 9);
        killCount++;
      }
    } catch (e) {
      // Process already dead or permissions issue
    }
  }

  console.log(\`✅ Native sweep completed. Terminated \${killCount} processes.\`);
}

nativeKill();
`;

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📤 Uploading native killer script...');
    await ssh.execCommand(`cat << 'EOF' > /tmp/native_kill.js\n${scriptCode}\nEOF`);
    
    console.log('🚨 RUNNING NATIVE KILL SWEEP:');
    const result = await ssh.execCommand('node /tmp/native_kill.js');
    console.log(result.stdout || result.stderr || 'No output');

    console.log('🧹 Purging Linux kernel page caches...');
    await ssh.execCommand('sync && echo 3 > /proc/sys/vm/drop_caches');

    console.log('📡 POST-KILL MEMORY STATS:');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
