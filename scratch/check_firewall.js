const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('=== UFW STATUS ===');
    const ufw = await ssh.execCommand('ufw status');
    console.log(ufw.stdout || ufw.stderr);

    console.log('\n=== IPTABLES RULES ===');
    const iptables = await ssh.execCommand('iptables -L -n -v');
    console.log(iptables.stdout || iptables.stderr);

    console.log('\n=== NETFILTER (NFT) RULES ===');
    const nft = await ssh.execCommand('nft list ruleset');
    console.log(nft.stdout || nft.stderr);

    console.log('\n=== NGINX CONFIG TEST ===');
    const nginxTest = await ssh.execCommand('nginx -t');
    console.log(nginxTest.stdout || nginxTest.stderr);

  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
