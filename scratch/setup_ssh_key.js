const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const ssh = new NodeSSH();

async function main() {
  const homeDir = os.homedir();
  const sshDir = path.join(homeDir, '.ssh');
  const pubKeyPath = path.join(sshDir, 'id_rsa.pub');
  const privKeyPath = path.join(sshDir, 'id_rsa');

  // 1. Generate SSH key locally if it does not exist
  if (!fs.existsSync(pubKeyPath)) {
    console.log('Generating local SSH key...');
    fs.mkdirSync(sshDir, { recursive: true });
    execSync(`ssh-keygen -t rsa -N "" -f "${privKeyPath}"`, { stdio: 'inherit' });
  }

  const pubKey = fs.readFileSync(pubKeyPath, 'utf8').trim();
  console.log('Local Public Key:', pubKey);

  // 2. Connect to remote server using password
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  console.log('Connected to remote server. Adding public key to authorized_keys...');
  
  await ssh.execCommand('mkdir -p /root/.ssh && chmod 700 /root/.ssh');
  await ssh.execCommand(`echo "${pubKey}" >> /root/.ssh/authorized_keys`);
  await ssh.execCommand('chmod 600 /root/.ssh/authorized_keys');

  console.log('Verifying key addition...');
  const check = await ssh.execCommand('tail -n 1 /root/.ssh/authorized_keys');
  console.log('Last key in authorized_keys:', check.stdout.trim());

  ssh.dispose();
  console.log('✅ SSH Key setup complete!');
}

main().catch(console.error);
