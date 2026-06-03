import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkMinerParent() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- PPID AND DETAILS ---');
    const ppid = await ssh.execCommand('ps -o ppid,pgid,sid,comm,args -p 3838005');
    console.log(ppid.stdout || ppid.stderr);

    const parentId = ppid.stdout.trim().split('\n')[1]?.trim().split(/\s+/)[0];
    if (parentId && parentId !== '1') {
      console.log(`\n--- PARENT PROCESS (${parentId}) DETAILS ---`);
      const parentDetails = await ssh.execCommand(`ps -f -p ${parentId}`);
      console.log(parentDetails.stdout || parentDetails.stderr);
    } else {
      console.log('Parent process is 1 (systemd/init).');
    }

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkMinerParent();
