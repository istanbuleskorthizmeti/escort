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

    console.log('--- Printing Exact HTTP Status Codes ---');
    
    const esenyurt = await ssh.execCommand('curl -I -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/esenyurt | head -n 1');
    console.log('/istanbul/esenyurt Status:', esenyurt.stdout.trim());

    const beylikduzu = await ssh.execCommand('curl -I -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/beylikduzu | head -n 1');
    console.log('/istanbul/beylikduzu Status:', beylikduzu.stdout.trim());

    const dynamicDb = await ssh.execCommand('curl -I -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/merkez-kategori-rus-escort | head -n 1');
    console.log('/istanbul/merkez-kategori-rus-escort Status:', dynamicDb.stdout.trim());

    // Print headers for the dynamic page to check canonical and robots tag
    const dynamicHeaders = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/merkez-kategori-rus-escort | grep -E "canonical|robots"');
    console.log('\nDynamic Page Meta Tags:\n', dynamicHeaders.stdout.trim());

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
