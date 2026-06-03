const { NodeSSH } = require('node-ssh');

const servers = [
  { name: 'Escort-NewPass', host: '213.232.235.181', pass: '5TVuj6qiHMfh8CxH9O!' },
  { name: 'Escort-OldPass', host: '213.232.235.181', pass: '4TVuj7qiHMfh7CxH6K!' },
  { name: 'Attack-OldPass', host: '187.77.111.203', pass: 'Z4-nN8JfiUIh5,;g' },
  { name: 'Attack-NewPass', host: '187.77.111.203', pass: '5TVuj6qiHMfh8CxH9O!' },
  { name: 'Dizi-OldPass', host: '45.93.137.164', pass: 'Z4-nN8JfiUIh5,;g' },
  { name: 'Dizi-NewPass', host: '45.93.137.164', pass: '5TVuj6qiHMfh8CxH9O!' }
];

async function run() {
  for (const s of servers) {
    const ssh = new NodeSSH();
    try {
      console.log(`Trying ${s.name} on ${s.host}...`);
      await ssh.connect({
        host: s.host,
        username: 'root',
        password: s.pass,
        readyTimeout: 10000
      });
      console.log(`  ✅ CONNECTED to ${s.name} (${s.host})!`);
      const uptimeRes = await ssh.execCommand('uptime');
      console.log(`  Uptime: ${uptimeRes.stdout.trim()}`);
      const psRes = await ssh.execCommand('ps aux --sort=-pcpu | head -n 5');
      console.log(`  Top CPU:\n${psRes.stdout}`);
      ssh.dispose();
    } catch (e) {
      console.log(`  ❌ FAILED: ${e.message}`);
    }
  }
}

run();
