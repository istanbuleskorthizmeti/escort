import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📝 Injecting console log trace points inside telegram-blast to debug the sendPhoto call execution...');
    // We will read and add temporary debug prints
    const cmd = `node -e "
      const { executeBlast } = require('./dist_scripts/scripts/master/telegram-blast');
      executeBlast().catch(console.error);
    "`;
    const res = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
