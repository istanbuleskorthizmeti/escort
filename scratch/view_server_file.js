const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Viewing Server lib/site-context.ts ---');
    const res = await ssh.execCommand('cat /root/esc/lib/site-context.ts');
    console.log(res.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
