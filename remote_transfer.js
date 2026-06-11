require('dotenv').config();
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: process.env.ATTACK_SERVER_IP || '187.77.111.203',
      username: process.env.ATTACK_SERVER_USER || 'root',
      password: process.env.ATTACK_SERVER_PASS || 'Z4-nN8JfiUIh5,;g'
    });
    
    console.log(`Connected to ${process.env.ATTACK_SERVER_IP || '187.77.111.203'}`);
    const action = process.argv[2];
    if (action === 'download') {
      await ssh.getFile(process.argv[4], process.argv[3]);
      console.log('Downloaded file successfully');
    } else if (action === 'upload') {
      await ssh.putFile(process.argv[3], process.argv[4]);
      console.log('Uploaded file successfully');
    }
  } catch(e) {
    console.error('Error:', e);
  } finally {
    ssh.dispose();
  }
}
run();
