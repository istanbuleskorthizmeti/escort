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

    const files = [
      '/etc/cron.d/syscheck',
      '/etc/sudoers.d/99-pakchoi',
      '/etc/rc.local',
      '/etc/systemd/system/multipathd.service',
      '/etc/lrt',
      '/root/.xmrig/config.json'
    ];

    for (const f of files) {
      console.log(`\n=== File: ${f} ===`);
      const res = await ssh.execCommand(`cat "${f}"`);
      console.log(res.stdout || res.stderr || 'Not found/empty');
    }

    console.log('\n=== Checking /etc/passwd for hydra_secure or other new users ===');
    const passwdRes = await ssh.execCommand('tail -n 10 /etc/passwd');
    console.log(passwdRes.stdout);

    console.log('\n=== Checking tail of /etc/profile, /etc/bash.bashrc, ~/.profile, ~/.bashrc ===');
    const tailRes = await ssh.execCommand('tail -n 10 /etc/profile /etc/bash.bashrc ~/.profile ~/.bashrc 2>/dev/null');
    console.log(tailRes.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
