const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    
    console.log('📡 Connected to configure firewall via nftables...');

    const commands = [
      // 1. Create a basic table if it does not exist
      'nft add table inet filter || true',
      
      // 2. Create chain for output if it does not exist
      'nft add chain inet filter output { type filter hook output priority 0 \\; } || true',
      
      // 3. Create chain for input if it does not exist
      'nft add chain inet filter input { type filter hook input priority 0 \\; } || true',

      // 4. Drop egress to malicious IPs
      'nft add rule inet filter output ip daddr 107.175.89.136 reject || true',
      'nft add rule inet filter output ip daddr 31.58.226.146 reject || true',

      // 5. Drop ingress from malicious IPs
      'nft add rule inet filter input ip saddr 107.175.89.136 drop || true',
      'nft add rule inet filter input ip saddr 31.58.226.146 drop || true',

      // 6. List rules to confirm
      'nft list ruleset'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      console.log(res.stdout || res.stderr || 'Success');
    }

    console.log('✅ nftables configuration complete!');
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    ssh.dispose();
  }
}

main();
