import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '31.97.79.34',
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected.');

    // Fetch CSS through Nginx by sending host header directly to the new IP
    const directRes = await ssh.execCommand('curl -i -H "Host: istanbulescort.blog" http://31.97.79.34/_next/static/css/5e5a9d027d10ede1.css');
    console.log('--- HEADERS FROM VPS DIRECT ---');
    console.log(directRes.stdout.substring(0, 600));

    console.log('--- CONTENT CONTAINS @apply? ---');
    console.log(directRes.stdout.includes('@apply'));

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
