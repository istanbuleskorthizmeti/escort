import { NodeSSH } from 'node-ssh';
import { getSSHConfig } from './lib/ssh-helper';

const ssh = new NodeSSH();
const config = getSSHConfig();

async function run() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');
    
    console.log('📡 DOCKER STATUS:');
    const result = await ssh.execCommand('docker ps -a');
    console.log(result.stdout || result.stderr || 'No Docker or no output');

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
