import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function checkContext() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('\n--- FINDING ALL OCCURRENCES of returnNaN WITH CONTEXT IN PAGE.JS ---');
    // Using grep -o with some characters before and after to see context in the single-line webpack bundle
    const grepRes = await ssh.execCommand(
      `grep -o -E '.{0,150}returnNaN.{0,150}' /root/esc/.next/server/app/\\[...slug\\]/page.js`
    );
    console.log(grepRes.stdout || grepRes.stderr || 'No matches.');

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

checkContext();
