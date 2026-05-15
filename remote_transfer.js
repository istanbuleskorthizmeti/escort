const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });
    
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
