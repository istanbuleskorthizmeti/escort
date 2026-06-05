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

    const localZip = path.join(process.cwd(), 'public', 'media.zip');
    const remoteZip = '/root/esc/public/media.zip';

    console.log('📤 Uploading public/media.zip (this might take a few moments)...');
    await ssh.putFile(localZip, remoteZip);
    console.log('✅ Uploaded media archive successfully.');

    console.log('⚙️ Extracting archive on server via Python...');
    // Create the target folder and extract
    await ssh.execCommand('mkdir -p /root/esc/public/_media');
    const extractRes = await ssh.execCommand('python3 -m zipfile -e /root/esc/public/media.zip /root/esc/public/_media/');
    console.log('Extraction stdout:', extractRes.stdout);
    console.log('Extraction stderr:', extractRes.stderr);

    console.log('🧹 Cleaning up zip archive on server...');
    await ssh.execCommand('rm -f /root/esc/public/media.zip');

    console.log('⚡ Running image compression script on all media files...');
    const compressRes = await ssh.execCommand('node /root/esc/scripts/compress-images.js');
    console.log('--- COMPRESSION STDOUT ---');
    console.log(compressRes.stdout);
    console.log('--- COMPRESSION STDERR ---');
    console.log(compressRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('❌ Error uploading and extracting media:', err.message);
    ssh.dispose();
  }
}

run();
