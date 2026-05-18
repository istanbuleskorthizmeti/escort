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
    
    console.log('📝 Querying the exact array length of vitrinImages and selected size in the compiled remote process...');
    const cmd = `node -r dotenv/config -e "
      const { vitrinImages } = require('./dist_scripts/lib/vitrin-images');
      console.log('vitrinImages length:', vitrinImages.length);
      const selected = vitrinImages.slice(0, 5);
      console.log('Sample item:', selected[0]);
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
