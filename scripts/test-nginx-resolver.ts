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

    console.log('--- TEST LOCAL RESOLUTION (HOST HEADER OVERRIDE ON PORT 80) ---');
    const port80 = await ssh.execCommand('curl -I -H "Host: serp.dorukcanay.digital" http://127.0.0.1/');
    console.log(port80.stdout || port80.stderr);

    console.log('--- TEST LOCAL RESOLUTION (RESOLVE TO LOCALHOST ON PORT 443) ---');
    const port443 = await ssh.execCommand('curl -I -k --resolve serp.dorukcanay.digital:443:127.0.0.1 https://serp.dorukcanay.digital/');
    console.log(port443.stdout || port443.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}

main();
