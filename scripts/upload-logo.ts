import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  const localLogoPath = path.resolve(__dirname, '../public/dorukcanay-logo.jpg');
  
  try {
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('📤 Uploading logo to /root/esc/public/dorukcanay-logo.jpg...');
    await ssh.putFile(localLogoPath, '/root/esc/public/dorukcanay-logo.jpg');

    console.log('📤 Uploading logo to /var/www/escortvip/public/dorukcanay-logo.jpg...');
    await ssh.putFile(localLogoPath, '/var/www/escortvip/public/dorukcanay-logo.jpg');

    console.log('📤 Uploading logo to /var/www/cdn/vitrin/dorukcanay-logo.jpg...');
    await ssh.putFile(localLogoPath, '/var/www/cdn/vitrin/dorukcanay-logo.jpg');

    console.log('✅ Logo upload completed successfully.');
  } catch (err) {
    console.error('❌ SSH/Upload error:', err);
  } finally {
    ssh.dispose();
  }
}

main();
