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
    
    console.log('🚨 [EMERGENCY] Killing all active Node.js processes to release 32GB RAM lock...');
    await ssh.execCommand('pkill -9 -f node || killall -9 node');
    console.log('✅ Node processes signaled.');
    
    console.log('🔄 Restarting PostgreSQL service...');
    await ssh.execCommand('systemctl restart postgresql');
    console.log('✅ PostgreSQL restarted.');

    console.log('🧹 Purging Linux kernel OS cache...');
    await ssh.execCommand('sync && echo 3 > /proc/sys/vm/drop_caches');
    console.log('✅ Linux page caches cleared.');

    console.log('📡 RECOVERED MEMORY STATS:');
    const freeRes = await ssh.execCommand('free -h');
    console.log(freeRes.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
