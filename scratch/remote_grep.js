const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Grepping for 107.175.89.136 in /root/esc ===');
  const res1 = await ssh.execCommand('grep -rn "107.175.89.136" /root/esc/ 2>/dev/null | head -n 50');
  console.log('Results (IP):', res1.stdout || 'None');

  console.log('=== Grepping for 9009 in /root/esc ===');
  const res2 = await ssh.execCommand('grep -rn "9009" /root/esc/ 2>/dev/null | head -n 50');
  console.log('Results (9009):', res2.stdout || 'None');

  console.log('=== Grepping for /let or /lrt in /root/esc ===');
  const res3 = await ssh.execCommand('grep -rn "chmod 755 /dev/let" /root/esc/ 2>/dev/null | head -n 50');
  console.log('Results (chmod):', res3.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
