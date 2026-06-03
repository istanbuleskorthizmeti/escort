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

    console.log('--- checking node/pm2/next processes ---');
    const pm2Proc = await ssh.execCommand('ps -ef | grep -E "node|pm2|next" | grep -v grep || echo "none"');
    console.log(pm2Proc.stdout);

    console.log('--- checking file attributes of the remaining malware files ---');
    const files = [
      '/var/tmp/.sys-2f3cbe98/kworker',
      '/root/.xmrig/kworker',
      '/etc/cron.d/syscheck'
    ];
    for (const f of files) {
      const attr = await ssh.execCommand(`lsattr "${f}" || echo "no lsattr"`);
      console.log(`${f}: ${attr.stdout.trim()}`);
    }

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
