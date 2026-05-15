import { NodeSSH } from 'node-ssh';

const server = { host: '187.77.111.203', username: 'root', password: 'Z4-nN8JfiUIh5,;g' };

async function deployToAttack() {
  const ssh = new NodeSSH();
  try {
    await ssh.connect(server);
    console.log('🚀 Sending deploy.zip to Attack Server (Gateway)...');
    
    await ssh.putFile('./deploy.zip', '/root/deploy.zip');
    console.log('✅ deploy.zip uploaded to Attack Server.');

    ssh.dispose();
  } catch (err: any) {
    console.error('❌ FAILED:', err.message);
  }
}

deployToAttack();
