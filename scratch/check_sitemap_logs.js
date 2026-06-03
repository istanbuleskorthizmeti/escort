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

    console.log('--- Triggering Sitemap and Checking Logs ---');
    await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/sitemap.xml > /dev/null');
    
    const logs = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 20 --nostream');
    console.log(logs.stdout || logs.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
