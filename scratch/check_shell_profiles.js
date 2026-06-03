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

    console.log('--- Checking Shell Profiles ---');
    
    console.log('\n--- /root/.bashrc ---');
    const bashrc = await ssh.execCommand('tail -n 30 /root/.bashrc');
    console.log(bashrc.stdout);

    console.log('\n--- /etc/profile ---');
    const profile = await ssh.execCommand('tail -n 30 /etc/profile');
    console.log(profile.stdout);

    console.log('\n--- /root/.profile ---');
    const rootProfile = await ssh.execCommand('tail -n 30 /root/.profile');
    console.log(rootProfile.stdout);

    console.log('\n--- /etc/bash.bashrc ---');
    const bashBashrc = await ssh.execCommand('tail -n 30 /etc/bash.bashrc');
    console.log(bashBashrc.stdout);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
