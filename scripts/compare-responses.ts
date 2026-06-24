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

    // 1. Fetch static CSS directly from NextJS (Port 3001)
    const nextjsCss = await ssh.execCommand('curl -I http://127.0.0.1:3001/_next/static/css/5e5a9d027d10ede1.css');
    console.log('--- CSS VIA NEXTJS (3001) ---');
    console.log(nextjsCss.stdout || nextjsCss.stderr);

    // 2. Fetch static CSS via Nginx (Port 80 with localhost headers)
    const nginxCss = await ssh.execCommand('curl -I -H "Host: istanbulescort.blog" http://127.0.0.1/_next/static/css/5e5a9d027d10ede1.css');
    console.log('--- CSS VIA NGINX (80) ---');
    console.log(nginxCss.stdout || nginxCss.stderr);

    // 3. Print Nginx configuration for one of the domains or the main config
    const nginxConf = await ssh.execCommand('cat /etc/nginx/sites-enabled/default || cat /etc/nginx/nginx.conf');
    console.log('--- NGINX CONFIGURATION ---');
    console.log(nginxConf.stdout.substring(0, 1500));

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
