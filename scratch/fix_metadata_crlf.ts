import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '213.232.235.181',
  port: 2222,
  username: 'root',
  password: '5TVuj6qiHMfh8CxH9O!'
};

async function fixCrlf() {
  try {
    console.log('📡 Connecting to server...');
    await ssh.connect(config);
    console.log('✅ SSH Connected.');

    console.log('🧹 Converting CRLF to LF for lib/seo-metadata.ts...');
    await ssh.execCommand("sed -i 's/\\r$//' /root/esc/lib/seo-metadata.ts");

    console.log('🧹 Converting CRLF to LF for all ts/tsx files in lib and app...');
    await ssh.execCommand("find /root/esc/lib /root/esc/app -type f -name '*.ts' -o -name '*.tsx' | xargs sed -i 's/\\r$//'");

    console.log('🏗️ Rebuilding...');
    const result = await ssh.execCommand('npm run build', { cwd: '/root/esc' });
    console.log('\n--- BUILD STDOUT ---');
    console.log(result.stdout);
    console.log('\n--- BUILD STDERR ---');
    console.log(result.stderr);

    ssh.dispose();
  } catch (err) {
    console.error('💥 Script failed:', err);
    ssh.dispose();
  }
}

fixCrlf();
