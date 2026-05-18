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
    
    console.log('📡 NEXT.JS FULL ROUTES MANIFEST:');
    const result = await ssh.execCommand('cat /root/esc/.next/routes-manifest.json');
    const manifest = JSON.parse(result.stdout);
    
    console.log('Static Routes:', manifest.staticRoutes.map((r: any) => r.page));
    console.log('Dynamic Routes:', manifest.dynamicRoutes.map((r: any) => r.page));
    
    ssh.dispose();
  } catch (err) {
    console.error('Error:', err);
    ssh.dispose();
  }
}

run();
