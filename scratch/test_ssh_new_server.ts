import { NodeSSH } from 'node-ssh';
const ssh = new NodeSSH();

// Usually GCP instances block direct root password auth. They require SSH key or standard user (e.g., onurk, or gcp username).
const config = {
  host: '34.185.231.84',
  username: 'onurk',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('Connecting to SSH as user onurk...');
    await ssh.connect(config);
    console.log('✅ Connected to 34.185.231.84 successfully!');
  } catch (e) {
    console.error('Connection failed:', e);
  } finally {
    ssh.dispose();
  }
}

run();
