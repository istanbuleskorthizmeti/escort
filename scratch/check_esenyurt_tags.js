const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function run() {
  let output = '--- Printing Esenyurt Meta Tags ---\n';
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    const esenyurtTags = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/esenyurt | grep -E "canonical|robots"');
    output += `Esenyurt Meta Tags:\n${esenyurtTags.stdout.trim()}\n`;

  } catch(e) {
    output += `Error: ${e.message}\n`;
  } finally {
    ssh.dispose();
    fs.writeFileSync('scratch/esenyurt_tags_output.txt', output);
    console.log('Saved output to scratch/esenyurt_tags_output.txt');
  }
}
run();
