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

    console.log('--- Testing DB Route Resolution in NextJS ---');
    const res = await ssh.execCommand('curl -s "http://localhost:3001/api/test-db-route?host=esenyurtescorthizmeti.shop&slug=istanbul-merkez-kategori-rus-escort"');
    console.log('API Response:\n', JSON.stringify(JSON.parse(res.stdout), null, 2));

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
