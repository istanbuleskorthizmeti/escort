const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== pm2 list ===');
  const res1 = await ssh.execCommand('pm2 list');
  console.log(res1.stdout);

  console.log('=== pm2 show for all processes ===');
  // Parse process IDs or names from pm2 jlist
  const res2 = await ssh.execCommand('pm2 jlist');
  try {
    const list = JSON.parse(res2.stdout);
    for (const proc of list) {
      console.log(`\n=== PM2 SHOW: ${proc.name} (ID: ${proc.pm_id}) ===`);
      const showRes = await ssh.execCommand(`pm2 show ${proc.pm_id}`);
      console.log(showRes.stdout);
    }
  } catch (e) {
    console.error('Error parsing pm2 jlist:', e);
  }

  ssh.dispose();
}

main().catch(console.error);
