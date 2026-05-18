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
    
    console.log('📝 Running direct visual SEO blast debug with environment variables loaded dynamically...');
    const cmd = `node -r dotenv/config -e "
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
