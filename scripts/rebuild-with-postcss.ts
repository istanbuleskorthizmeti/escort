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

    // 1. Upload the updated package.json
    console.log(' • Syncing package.json and postcss.config.js to the server...');
    await ssh.putFile('c:\\Users\\onurk\\esc\\package.json', '/var/www/escortvip/package.json');
    await ssh.putFile('c:\\Users\\onurk\\esc\\postcss.config.js', '/var/www/escortvip/postcss.config.js');
    console.log('   ✔ Synced.');

    // 2. Install dependencies
    console.log(' • Installing dependencies on the server...');
    const installRes = await ssh.execCommand('npm install --force', { cwd: '/var/www/escortvip' });
    console.log(installRes.stdout || installRes.stderr);

    // 3. Build NextJS
    console.log(' • Building NextJS production app...');
    const buildRes = await ssh.execCommand('npm run build', { cwd: '/var/www/escortvip' });
    console.log('=== BUILD CODE ===', buildRes.code);
    console.log('=== BUILD STDOUT ===');
    console.log(buildRes.stdout);
    console.log('=== BUILD STDERR ===');
    console.log(buildRes.stderr);

    // 4. Verify generated CSS
    const findCss = await ssh.execCommand('find /var/www/escortvip/.next/static/css/ -name "*.css"');
    console.log('--- NEW GENERATED CSS ---');
    console.log(findCss.stdout);

    const cssPaths = findCss.stdout.trim().split('\n');
    for (const cssPath of cssPaths) {
      if (!cssPath) continue;
      const directCheck = await ssh.execCommand(`grep -o "@apply" ${cssPath}`);
      console.log(`Grep check on ${cssPath}: contains @apply?`, directCheck.stdout.split('\n').filter(Boolean).length > 0);
    }

    // 5. Restart PM2
    console.log(' • Restarting esc-live in PM2...');
    const restartRes = await ssh.execCommand('pm2 restart esc-live');
    console.log(restartRes.stdout || restartRes.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
