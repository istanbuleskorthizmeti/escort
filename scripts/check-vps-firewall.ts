import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  console.log('🩺 [FIREWALL DIAGNOSTIC] Checking firewall rules on the new VPS...');
  console.log('------------------------------------------------------------------');

  try {
    await ssh.connect(config);
    console.log('✅ Connected via SSH.');

    console.log('\n--- 🛡️ UFW STATUS ---');
    const ufw = await ssh.execCommand('ufw status');
    console.log(ufw.stdout || ufw.stderr || 'No ufw command found or disabled.');

    console.log('\n--- 🛡️ IPTABLES RULES ---');
    const iptables = await ssh.execCommand('iptables -L -n -v | head -n 30');
    console.log(iptables.stdout || iptables.stderr);

    console.log('\n--- 🛡️ ENABLING HTTP & HTTPS IN UFW ---');
    const allowHttp = await ssh.execCommand('ufw allow 80/tcp && ufw allow 443/tcp && ufw reload');
    console.log(allowHttp.stdout || allowHttp.stderr);

    console.log('\n--- 🛡️ NEW UFW STATUS ---');
    const ufwNew = await ssh.execCommand('ufw status');
    console.log(ufwNew.stdout);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
