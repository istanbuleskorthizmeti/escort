const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });
  
  const files = [
    '/etc/lrt', '/etc/let', '/root/esc/lrt', '/root/esc/let',
    '/tmp/.d', '/tmp/let', '/tmp/lrt', '/var/lrt', '/var/let', '/lrt'
  ];
  
  for (const f of files) {
    console.log(`\n=== File: ${f} ===`);
    const fileRes = await ssh.execCommand(`file "${f}" 2>/dev/null`);
    console.log('Type:', fileRes.stdout.trim() || 'Not found');
    
    // If it is ASCII text or small size, print it
    const lsRes = await ssh.execCommand(`ls -lh "${f}" 2>/dev/null`);
    console.log('Details:', lsRes.stdout.trim());
    
    if (fileRes.stdout.includes('text') || fileRes.stdout.includes('empty')) {
      const catRes = await ssh.execCommand(`cat "${f}" 2>/dev/null`);
      console.log('Content:', catRes.stdout.trim() || '[Empty]');
    }
  }
  
  ssh.dispose();
}

main().catch(console.error);
