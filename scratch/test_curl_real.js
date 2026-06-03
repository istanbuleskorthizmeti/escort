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

    console.log('--- Testing Real Live URL ---');
    const res = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/merkez-kategori-rus-escort | grep -A 4 -B 4 "canonical" || echo "NOT FOUND OR EMPTY"');
    console.log(res.stdout || res.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
