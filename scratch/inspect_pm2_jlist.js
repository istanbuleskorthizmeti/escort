const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function main() {
  await ssh.connect({
    host: '213.232.235.181',
    port: 2222,
    username: 'root',
    password: '5TVuj6qiHMfh8CxH9O!'
  });

  const res = await ssh.execCommand('pm2 jlist');
  try {
    const list = JSON.parse(res.stdout);
    for (const proc of list) {
      console.log(`Proc: ${proc.name}, script: ${proc.pm2_env.pm_exec_path}, args: ${JSON.stringify(proc.pm2_env.args)}, exec_mode: ${proc.pm2_env.exec_mode}`);
    }
  } catch (e) {
    console.error('Error parsing pm2 jlist:', e);
  }

  ssh.dispose();
}

main().catch(console.error);
