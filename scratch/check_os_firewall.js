const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('=== Checking available package manager and OS release ===');
  const res1 = await ssh.execCommand('cat /etc/os-release');
  console.log(res1.stdout);

  console.log('=== Checking firewall tool availability (nftables, ufw, firewalld, iptables) ===');
  const res2 = await ssh.execCommand('which ufw nft firewalld iptables || true');
  console.log(res2.stdout || 'None');

  ssh.dispose();
}

main().catch(console.error);
