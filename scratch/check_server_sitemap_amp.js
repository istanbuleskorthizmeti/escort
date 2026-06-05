const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Searching for sitemap and amp in app/ ---');
    const searchRes = await ssh.execCommand('find /var/www/escortvip/app -name "sitemap*" -o -name "amp*"');
    console.log(searchRes.stdout || searchRes.stderr || 'No matches.');
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
