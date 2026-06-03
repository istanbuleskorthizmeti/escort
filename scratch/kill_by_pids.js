const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });
    
    console.log('📡 Connected to perform aggressive kill on running malware processes...');

    const commands = [
      // 1. Send SIGKILL directly to process IDs
      'kill -9 3719185 3719199 || true',
      
      // 2. Double check if they are gone
      'ps -ef | grep -E "y28m|8hPA|gWDE" | grep -v grep || echo "Clean"'
    ];

    for (const cmd of commands) {
      console.log(`Executing: ${cmd}`);
      const res = await ssh.execCommand(cmd);
      console.log(res.stdout || res.stderr || 'Success');
    }

    console.log('✅ Specific Process ID targets killed!');
  } catch (err) {
    console.error('❌ Failed:', err);
  } finally {
    ssh.dispose();
  }
}

main();
