import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkSwapAndKernel() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- VERIFYING KERNEL SYSCTL MEMORY SETTINGS ---');
    const sysctl = await ssh.execCommand('sysctl vm.overcommit_memory vm.overcommit_ratio vm.max_map_count kernel.pid_max');
    console.log(sysctl.stdout);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkSwapAndKernel();
