const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkServers() {
  const servers = [
    { name: 'Attack', host: '187.77.111.203', pass: 'Z4-nN8JfiUIh5,;g' },
    { name: 'Dizi', host: '45.93.137.164', pass: 'Z4-nN8JfiUIh5,;g' },
    { name: 'Escort', host: '213.232.235.181', pass: '4TVuj7qiHMfh7CxH6K!' }
  ];

  for (const s of servers) {
    try {
      await ssh.connect({
        host: s.host,
        username: 'root',
        password: s.pass
      });
      console.log(`✅ [${s.name}] Connected to ${s.host}`);
      
      const dbCheck = await ssh.execCommand('pg_isready');
      console.log(`   🗄️ DB Status: ${dbCheck.stdout.trim() || dbCheck.stderr.trim() || 'Not Found'}`);
      
      const pm2Check = await ssh.execCommand('pm2 list');
      if (pm2Check.stdout.includes('online')) {
          console.log(`   🚀 PM2: Running`);
      } else {
          console.log(`   💤 PM2: No active processes`);
      }

      ssh.dispose();
    } catch (err) {
      console.error(`❌ [${s.name}] Failed: ${err.message}`);
    }
  }
}

checkServers();
