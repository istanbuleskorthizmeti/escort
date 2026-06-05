const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- whois 213.232.235.181 ---');
    const whoisRes = await ssh.execCommand('whois 213.232.235.181 | grep -i -E "orgname|netname|descr|provider|owner"');
    console.log(whoisRes.stdout || whoisRes.stderr || 'No WHOIS output.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
