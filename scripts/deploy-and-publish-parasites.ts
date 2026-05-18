import { NodeSSH } from 'node-ssh';
import path from 'path';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  username: 'root',
  password: '4TVuj7qiHMfh7CxH6K!'
};

async function run() {
  try {
    console.log('🚀 [DEPLOY SOVEREIGN PARASITE PUBLISHER] Connecting to 213.232.235.181...');
    await ssh.connect(config);
    console.log('✅ Connected.');

    // 1. Upload scripts/publish_supreme_parasites.js to remote VPS
    console.log('📤 [UPLOAD] Uploading scripts/publish_supreme_parasites.js to remote VPS...');
    await ssh.putFile(
      path.join(process.cwd(), 'scripts', 'publish_supreme_parasites.js'),
      '/root/esc/scripts/publish_supreme_parasites.js'
    );
    console.log('✅ Native publisher JS file sync complete.');

    // Note: We don't execute the publisher immediately because we want to wait 
    // for all articles to finish generating first, OR if the articles are finished 
    // we can run it! But wait, we can also give the user a quick script to run it 
    // whenever they want or run it autonomously in the background!
    
    ssh.dispose();
    console.log('🏁 [FINISHED] Publisher deployed successfully. Native run is now available!');
  } catch (err: any) {
    console.error('💥 Error:', err.message);
    ssh.dispose();
  }
}

run();
