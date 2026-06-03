const { NodeSSH } = require('node-ssh');

async function poll() {
  const host = '213.232.235.181';
  const username = 'root';
  const password = '5TVuj6qiHMfh8CxH9O!';

  console.log(`Starting SSH polling for ${host}...`);

  while (true) {
    const ssh = new NodeSSH();
    try {
      await ssh.connect({
        host,
        username,
        password,
        readyTimeout: 5000
      });
      console.log('\n🎉 SUCCESS! Connected to Escort server!');
      
      const uptime = await ssh.execCommand('uptime');
      console.log('Uptime:', uptime.stdout);
      
      // Let's run a quick process check
      const ps = await ssh.execCommand('ps aux --sort=-%cpu | head -n 10');
      console.log('Top CPU Processes:\n', ps.stdout);

      ssh.dispose();
      break;
    } catch (e) {
      process.stdout.write('.');
      ssh.dispose();
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

poll();
