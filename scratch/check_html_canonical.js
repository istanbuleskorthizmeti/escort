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

    console.log('--- Checking Canonical tags in HTML ---');
    const res1 = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/esenyurt-escort | grep -A 2 -B 2 "canonical"');
    console.log('Esenyurt page canonical lines:\n', res1.stdout);

    const res2 = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/besiktas-escort | grep -A 2 -B 2 "canonical"');
    console.log('Besiktas page canonical lines:\n', res2.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
