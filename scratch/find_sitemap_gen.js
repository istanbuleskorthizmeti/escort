const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- searching for Sitemap generation code on server ---');
    const findRes = await ssh.execCommand('grep -rn "Generating Sitemaps for" /var/www/escortvip/ 2>/dev/null || echo "Not found"');
    console.log(findRes.stdout || findRes.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
