import { NodeSSH } from 'node-ssh';

async function testAll() {
  const servers = [
    { name: 'Sovereign Core (213.232.235.181)', host: '213.232.235.181', user: 'root', pass: '4TVuj7qiHMfh7CxH6K!', ports: [22, 2222] },
    { name: 'Sovereign Core - .env alternate pass', host: '213.232.235.181', user: 'root', pass: '5TVuj6qiHMfh8CxH9O!', ports: [22, 2222] },
    { name: 'Production Server IP from .env', host: '187.77.111.203', user: 'root', pass: 'Z4-nN8JfiUIh5,;g', ports: [22, 2222] }
  ];

  for (const s of servers) {
    for (const port of s.ports) {
      const ssh = new NodeSSH();
      try {
        console.log(`📡 Testing [${s.name}] on port ${port}...`);
        await ssh.connect({
          host: s.host,
          username: s.user,
          password: s.pass,
          port: port,
          readyTimeout: 10000
        });
        console.log(`🎉 SUCCESS! Connected to [${s.name}] on port ${port}!`);
        const uptime = await ssh.execCommand('uptime');
        console.log(`Uptime: ${uptime.stdout.trim()}`);
        ssh.dispose();
        return; // Found a working one, stop testing
      } catch (err) {
        console.log(`❌ Failed: ${err instanceof Error ? err.message : err}`);
        ssh.dispose();
      }
    }
  }
}

testAll();
