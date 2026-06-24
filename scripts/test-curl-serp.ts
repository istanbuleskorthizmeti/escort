import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

const config = {
  host: '31.97.79.34',
  username: 'root',
  password: 'Oym@icdLt?vY8YQy'
};

async function main() {
  try {
    await ssh.connect(config);
    console.log('✅ Connected.');

    console.log('--- CURL LOCALHOST:5000 ---');
    const localRes = await ssh.execCommand('curl -I http://127.0.0.1:5000/');
    console.log(localRes.stdout || localRes.stderr);

    console.log('--- CURL SERP.DORUKCANAY.DIGITAL OVER HTTP ---');
    const httpRes = await ssh.execCommand('curl -I http://serp.dorukcanay.digital/');
    console.log(httpRes.stdout || httpRes.stderr);

    console.log('--- CURL SERP.DORUKCANAY.DIGITAL OVER HTTPS ---');
    const httpsRes = await ssh.execCommand('curl -I -k https://serp.dorukcanay.digital/');
    console.log(httpsRes.stdout || httpsRes.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
