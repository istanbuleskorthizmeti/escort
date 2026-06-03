import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function fixEnv() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('📝 Reading remote .env file...');
    const readRes = await ssh.execCommand('cat /root/esc/.env');
    let envContent = readRes.stdout;
    if (!envContent) {
      throw new Error('Failed to read remote .env file: ' + readRes.stderr);
    }

    console.log('🔄 Modifying DATABASE_URL to use 127.0.0.1 instead of public IP...');
    const searchString = 'DATABASE_URL="postgresql://vuc2026_user:vuc2026_pass@213.232.235.181:5432/vuc2026?sslmode=disable"';
    const replacementString = 'DATABASE_URL="postgresql://vuc2026_user:vuc2026_pass@127.0.0.1:5432/vuc2026?sslmode=disable"';

    if (envContent.includes(searchString)) {
      envContent = envContent.replace(searchString, replacementString);
      console.log('✅ Found and updated the DATABASE_URL line.');
    } else {
      console.log('⚠️ Strict line match not found. Attempting regex replacement...');
      envContent = envContent.replace(
        /DATABASE_URL="postgresql:\/\/([^:]+):([^@]+)@213\.232\.235\.181:5432\/([^"]+)"/,
        'DATABASE_URL="postgresql://$1:$2@127.0.0.1:5432/$3"'
      );
    }

    console.log('💾 Writing modified .env back to remote server...');
    // Write contents to a temporary file, then move it to .env
    const base64Content = Buffer.from(envContent).toString('base64');
    await ssh.execCommand(`echo "${base64Content}" | base64 -d > /root/esc/.env`);
    console.log('✅ Remote .env updated.');

    console.log('🚀 [PM2] Restarting Next.js processes to apply new database URL...');
    await ssh.execCommand('pm2 restart drkcnay-web-cluster');

    console.log('⏳ Waiting 5 seconds for application to start...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n--- PM2 ERROR LOGS (LAST 15 LINES) ---');
    const logsRes = await ssh.execCommand('pm2 logs drkcnay-web-cluster --lines 15 --err --nostream');
    console.log(logsRes.stdout || logsRes.stderr);

    console.log('\n--- VERIFYING HOME PAGE VIA NGINX ---');
    const curlRes = await ssh.execCommand('curl -I -H "Host: dorukcanay.digital" http://127.0.0.1');
    console.log(curlRes.stdout || curlRes.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

fixEnv();
