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

function getProcessDiagnostics() {
  const files = fs.readdirSync('/proc');
  const processes = [];

  for (const file of files) {
    if (!/^\\d+$/.test(file)) continue;
    const pid = file;
    try {
      const statusContent = fs.readFileSync(path.join('/proc', pid, 'status'), 'utf8');
      const cmdline = fs.readFileSync(path.join('/proc', pid, 'cmdline'), 'utf8').replace(/\\0/g, ' ').trim();
      
      const nameMatch = statusContent.match(/^Name:\\s+(.+)$/m);
      const rssMatch = statusContent.match(/^VmRSS:\\s+(\\d+)\\s+kB$/m);
      
      const name = nameMatch ? nameMatch[1] : 'unknown';
      const rssKb = rssMatch ? parseInt(rssMatch[1], 10) : 0;
      
      processes.push({ pid, name, rssKb, cmdline });
    } catch (e) {
      // Process might have terminated
    }
  }

  processes.sort((a, b) => b.rssKb - a.rssKb);

  console.log('📡 TOP 30 PROCESSES BY RAM ON DROPLET:');
  console.log('---------------------------------------------------------');
  console.log('PID\\tVmRSS(MB)\\tName\\tCmdline');
  console.log('---------------------------------------------------------');
  for (let i = 0; i < Math.min(30, processes.length); i++) {
    const p = processes[i];
    console.log(\`\${p.pid}\\t\${(p.rssKb / 1024).toFixed(1)}\\t\${p.name}\\t\${p.cmdline.slice(0, 100)}\`);
  }
}

getProcessDiagnostics();
`;

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    // Write the diagnostic script directly to the droplet
    console.log('📤 Uploading remote diagnostic script...');
    await ssh.execCommand(`cat << 'EOF' > /tmp/diag.js\n${scriptCode}\nEOF`);
    
    console.log('📡 RUNNING REMOTE DIAGNOSTIC:');
    const result = await ssh.execCommand('node /tmp/diag.js');
    console.log(result.stdout || result.stderr || 'No output');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
