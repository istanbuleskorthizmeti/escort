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

    console.log('--- Printing Head Section ---');
    const res = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/esenyurt-escort | head -n 120');
    console.log(res.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
