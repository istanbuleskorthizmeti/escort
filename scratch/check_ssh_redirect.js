import { Client } from 'ssh2';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const sshConfig = {
  host: process.env.SSH_HOST || '213.232.235.181',
  port: 22,
  username: process.env.SSH_USER || 'root',
  password: process.env.SSH_PASSWORD || '5TVuj6qiHMfh8CxH9O!'
};

function runRemoteCommand() {
  const conn = new Client();
  console.log(`📡 Connecting to VPS ${sshConfig.host} via SSH...`);
  
  conn.on('ready', () => {
    console.log('✅ SSH Connection established! Running curl check on target domain...');
    conn.exec('curl -I -L --connect-timeout 10 https://istanbulescort.blog/', (err, stream) => {
      if (err) {
        console.error('Execution Error:', err.message);
        conn.end();
        return;
      }
      
      let stdout = '';
      let stderr = '';
      
      stream.on('close', (code, signal) => {
        console.log(`\n🏁 Command completed with code ${code}`);
        console.log('\n--- SSH STDOUT ---');
        console.log(stdout);
        console.log('\n--- SSH STDERR ---');
        console.log(stderr);
        conn.end();
      }).on('data', (data) => {
        stdout += data.toString();
      }).stderr.on('data', (data) => {
        stderr += data.toString();
      });
    });
  }).on('error', (err) => {
    console.error('SSH Connection Error:', err.message);
  }).connect(sshConfig);
}

runRemoteCommand();
