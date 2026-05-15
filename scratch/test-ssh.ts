import { NodeSSH } from 'node-ssh';

const server = { host: '213.232.235.181', username: 'root', password: '4TVuj7qiHMfh7CxH6K!' };

async function main() {
  const ssh = new NodeSSH();
  try {
    console.log(`Connecting to ${server.host}...`);
    await ssh.connect(server);
    console.log('✅ SSH Connected!');
    
    const res = await ssh.execCommand('ls -la /root/hydra');
    console.log('Output:', res.stdout);
    
    ssh.dispose();
  } catch (e) {
    console.error('❌ SSH Failed:', e.message);
  }
}

main();
