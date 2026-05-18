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
    
    console.log('📡 CURL 127.0.0.1:3001/ (ROOT INDEX):');
    const res1 = await ssh.execCommand('curl -sS -i http://127.0.0.1:3001/');
    console.log('Stdout:', res1.stdout.slice(0, 500));
    console.log('Stderr:', res1.stderr);

    console.log('\n📡 CURL 127.0.0.1:3001/sitemap.xml:');
    const res2 = await ssh.execCommand('curl -sS -i http://127.0.0.1:3001/sitemap.xml');
    console.log('Stdout:', res2.stdout.slice(0, 500));
    console.log('Stderr:', res2.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
