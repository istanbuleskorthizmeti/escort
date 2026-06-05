import { NodeSSH } from 'node-ssh';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const ssh = new NodeSSH();

async function testSSH() {
  const passwords = [
    '5TVuj6qiHMfh8CxH9O!',
    '4TVuj7qiHMfh7CxH6K!'
  ];

  const ports = [22, 2222];

  for (const port of ports) {
    for (const pwd of passwords) {
      const config = {
        host: '213.232.235.181',
        port: port,
        username: 'root',
        password: pwd,
        readyTimeout: 10000
      };

      console.log(`📡 Attempting SSH connection to port ${port} with password: ${pwd.substring(0, 4)}...`);
      try {
        await ssh.connect(config);
        console.log(`✅ SSH Connection Successful on port ${port} with password: ${pwd}`);
        ssh.dispose();
        return;
      } catch (err) {
        console.error(`❌ Failed on port ${port} with password ${pwd.substring(0, 4)}...:`, err.message);
      }
    }
  }
}

testSSH();
