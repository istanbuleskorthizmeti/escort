const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    console.log('📡 Connecting to Attack Server (187.77.111.203)...');
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('✅ Connected!');

    console.log('🏗️ Starting build in /var/www/escortvip with live logs...');
    await new Promise((resolve, reject) => {
      ssh.connection.exec('cd /var/www/escortvip && NODE_OPTIONS="--max-old-space-size=2048" npm run build', (err, stream) => {
        if (err) return reject(err);
        
        stream.on('close', (code, signal) => {
          console.log(`\n🛑 Process exited with code ${code} and signal ${signal}`);
          resolve(code);
        });
        
        stream.on('data', (data) => {
          process.stdout.write(data.toString());
        });
        
        stream.stderr.on('data', (data) => {
          process.stderr.write(data.toString());
        });
      });
    });
  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
