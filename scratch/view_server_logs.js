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

    console.log('--- Triggering Request and Viewing Logs ---');
    
    // Trigger request
    ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/merkez-kategori-rus-escort');
    
    // Get last 40 lines of PM2 log
    const logRes = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 40 --nostream');
    console.log(logRes.stdout || logRes.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
