const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function run() {
  let output = '--- Printing Exact HTTP Status Codes ---\n';
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    const esenyurt = await ssh.execCommand('curl -I -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/esenyurt | head -n 1');
    output += `/istanbul/esenyurt Status: ${esenyurt.stdout.trim()}\n`;

    const beylikduzu = await ssh.execCommand('curl -I -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/beylikduzu | head -n 1');
    output += `/istanbul/beylikduzu Status: ${beylikduzu.stdout.trim()}\n`;

    const dynamicDb = await ssh.execCommand('curl -I -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/merkez-kategori-rus-escort | head -n 1');
    output += `/istanbul/merkez-kategori-rus-escort Status: ${dynamicDb.stdout.trim()}\n`;

    // Print headers for the dynamic page to check canonical and robots tag
    const dynamicHeaders = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/merkez-kategori-rus-escort | grep -E "canonical|robots"');
    output += `Dynamic Page Meta Tags:\n${dynamicHeaders.stdout.trim()}\n`;

  } catch(e) {
    output += `Error: ${e.message}\n`;
  } finally {
    ssh.dispose();
    fs.writeFileSync('scratch/final_status_output.txt', output);
    console.log('Saved output to scratch/final_status_output.txt');
  }
}
run();
