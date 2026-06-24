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

    // 1. Find the generated CSS files
    const findCss = await ssh.execCommand('find /var/www/escortvip/.next/static/css/ -name "*.css"');
    console.log('--- GENERATED CSS FILES ---');
    console.log(findCss.stdout || findCss.stderr);

    const cssPaths = findCss.stdout.trim().split('\n');
    for (const cssPath of cssPaths) {
      if (!cssPath) continue;
      console.log(`\n--- FIRST 800 CHARS OF ${cssPath} ---`);
      const cssContent = await ssh.execCommand(`head -c 800 ${cssPath}`);
      console.log(cssContent.stdout);
    }

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
