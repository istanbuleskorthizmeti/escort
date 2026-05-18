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
    
    console.log('📡 Executing telegram-blast with debug logs enabled...');
    // Lets temporarily print the logs inside telegram-blast to see why 0 selected profiles was printed
    const execRes = await ssh.execCommand('node -r dotenv/config dist_scripts/scripts/master/telegram-blast.js', { 
      cwd: '/root/esc',
      env: { DEBUG: 'true' }
    });
    console.log(execRes.stdout || execRes.stderr || 'No response');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
