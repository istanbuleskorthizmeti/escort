const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Reading Nginx sites-enabled files ---');
    const lsRes = await ssh.execCommand('ls /etc/nginx/sites-enabled/');
    console.log('Sites:', lsRes.stdout);
    
    const files = lsRes.stdout.split('\n').map(f => f.trim()).filter(Boolean);
    for (const f of files) {
      console.log(`\n--- Config: ${f} ---`);
      const catRes = await ssh.execCommand(`cat /etc/nginx/sites-enabled/${f}`);
      console.log(catRes.stdout || catRes.stderr);
    }
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
