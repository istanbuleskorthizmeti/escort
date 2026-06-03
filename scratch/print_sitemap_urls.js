const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Printing Sitemap URLs ---');
    const res = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/sitemap.xml');
    const urls = res.stdout.match(/<loc>(.*?)<\/loc>/g) || [];
    console.log('Total URLs found:', urls.length);
    urls.forEach(u => console.log(u));

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
