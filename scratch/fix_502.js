const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function fix() {
  try {
    console.log('Connecting to 213.232.235.181...');
    await ssh.connect({
      host: '213.232.235.181',
      username: 'root',
      password: '4TVuj7qiHMfh7CxH6K!'
    });

    console.log('Connected. Killing heavy processes...');
    await ssh.execCommand('pkill -9 node; pkill -9 tsx; pkill -9 pm2; pm2 kill');
    
    console.log('Checking memory...');
    const mem = await ssh.execCommand('free -m');
    console.log(mem.stdout);

    console.log('Restarting Nginx...');
    await ssh.execCommand('systemctl restart nginx');

    console.log('Starting ONLY the main app (Lighter mode)...');
    // Using --max-old-space-size to prevent OOM
    await ssh.execCommand('cd /root/hydra && NODE_OPTIONS="--max-old-space-size=1024" pm2 start ./node_modules/.bin/next --name "hydra" -- start -p 3000');

    console.log('Done.');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

fix();
