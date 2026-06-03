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
    
    console.log('📡 Connected to configure iptables...');

    const commands = [
      // 1. Drop egress traffic to known malicious command & control IPs
      'iptables -A OUTPUT -d 107.175.89.136 -j REJECT || true',
      'iptables -A OUTPUT -d 31.58.226.146 -j REJECT || true',
      
      // 2. Drop ingress traffic from known malicious command & control IPs
      'iptables -A INPUT -s 107.175.89.136 -j DROP || true',
      'iptables -A INPUT -s 31.58.226.146 -j DROP || true',

      // 3. Make rules persistent if netfilter-persistent or iptables-persistent is installed
      'netfilter-persistent save || iptables-save > /etc/iptables/rules.v4 || true'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      console.log(res.stdout || res.stderr || 'Success');
    }

    console.log('✅ Iptables firewall configuration complete!');
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    ssh.dispose();
  }
}

main();
