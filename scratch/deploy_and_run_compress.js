const { NodeSSH } = require('node-ssh');
const fs = require('fs');
const path = require('path');

const ssh = new NodeSSH();

const config = {
  host: '187.77.111.203',
  username: 'root',
  password: 'Z4-nN8JfiUIh5,;g'
};

async function run() {
  try {
    console.log('📡 Connecting to active server...');
    await ssh.connect(config);
    console.log('✅ Connected via SSH.');

    const localScript = path.join(process.cwd(), 'scripts', 'compress-images.js');
    const remoteScript = '/root/esc/scripts/compress-images.js';

    console.log('📤 Uploading scripts/compress-images.js...');
    await ssh.putFile(localScript, remoteScript);
    console.log('✅ Uploaded script successfully.');

    console.log('⚙️ Executing Node compression engine on server...');
    
    // Execute command and stream output
    const execRes = await ssh.execCommand(`node ${remoteScript}`);
    
    console.log('--- STDOUT ---');
    console.log(execRes.stdout);
    console.log('--- STDERR ---');
    console.log(execRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('❌ Error executing remote compression:', err.message);
    ssh.dispose();
  }
}

run();
