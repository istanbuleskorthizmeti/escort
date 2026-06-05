import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function testSSH() {
  const passwords = [
    '5TVuj6qiHMfh8CxH9O!',
    '4TVuj7qiHMfh7CxH6K!'
  ];

  for (const pwd of passwords) {
    const config = {
      host: '213.232.235.181',
      username: 'root',
      password: pwd,
      readyTimeout: 10000
    };

    console.log(`📡 Attempting SSH connection with password: ${pwd.substring(0, 4)}...`);
    try {
      await ssh.connect(config);
      console.log('✅ SSH Connection Successful with password:', pwd);
      ssh.dispose();
      return;
    } catch (err) {
      console.error(`❌ Failed with password ${pwd.substring(0, 4)}...:`, err.message);
    }
  }
}

testSSH();
