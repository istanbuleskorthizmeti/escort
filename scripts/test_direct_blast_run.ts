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
    
    console.log('🚀 Triggering direct module run of compiled JavaScript bundle with dynamic environment prints...');
    const result = await ssh.execCommand('node -e "require(\'dotenv\').config(); require(\'./dist_scripts/scripts/master/telegram-blast\').executeBlast().then(console.log).catch(console.error)"', { cwd: '/root/esc' });
    console.log(result.stdout || result.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
