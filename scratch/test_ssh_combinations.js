const { Client } = require('ssh2');

const hosts = ['213.232.235.181'];
const ports = [22, 2222];
const passwords = ['5TVuj6qiHMfh8CxH9O!', '4TVuj7qiHMfh7CxH6K!'];

function testCombination(host, port, password) {
  return new Promise((resolve) => {
    const conn = new Client();
    let resolved = false;

    conn.on('ready', () => {
      console.log(`✅ SUCCESS: ${host}:${port} with password "${password}" connected!`);
      conn.exec('whoami && hostname', (err, stream) => {
        if (!err) {
          stream.on('data', (data) => console.log(`Output: ${data.toString().trim()}`));
        }
        conn.end();
        if (!resolved) {
          resolved = true;
          resolve(true);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ FAILED: ${host}:${port} with password "${password}" - Error: ${err.message}`);
      conn.end();
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    }).connect({
      host,
      port,
      username: 'root',
      password,
      readyTimeout: 5000
    });
  });
}

async function runTests() {
  for (const port of ports) {
    for (const password of passwords) {
      console.log(`Testing ${hosts[0]}:${port} with password "${password}"...`);
      const success = await testCombination(hosts[0], port, password);
      if (success) {
        console.log('🎉 Found working combination!');
        return;
      }
    }
  }
  console.log('😢 No combination worked.');
}

runTests();
