const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking Firebase Realtime / Firestore trigger code in codebase ===');
  // Check if firebase is imported in API routes or elsewhere
  const res1 = await ssh.execCommand('grep -rn "lib/firebase" /root/esc/app/ 2>/dev/null');
  console.log('Imports in app/:\n', res1.stdout || 'None');

  const res2 = await ssh.execCommand('grep -rn "lib/firebase" /root/esc/lib/ 2>/dev/null');
  console.log('Imports in lib/:\n', res2.stdout || 'None');

  const res3 = await ssh.execCommand('grep -rn "lib/firebase" /root/esc/scripts/ 2>/dev/null');
  console.log('Imports in scripts/:\n', res3.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
