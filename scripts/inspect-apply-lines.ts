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

    // Print lines containing @apply
    const grepLines = await ssh.execCommand('grep -n "@apply" /var/www/escortvip/.next/static/css/5e5a9d027d10ede1.css || grep -n -o -C 2 "@apply" /var/www/escortvip/.next/static/css/5e5a9d027d10ede1.css');
    console.log('--- LINES CONTAINING @apply ---');
    console.log(grepLines.stdout || grepLines.stderr);

    // Let's print characters 30000 to 35000 where the @apply is likely located
    const cssLength = await ssh.execCommand('wc -c /var/www/escortvip/.next/static/css/5e5a9d027d10ede1.css');
    console.log('--- CSS SIZE ---', cssLength.stdout.trim());

    // We can also extract segments containing @apply programmatically
    const script = `
      const fs = require('fs');
      const css = fs.readFileSync('/var/www/escortvip/.next/static/css/5e5a9d027d10ede1.css', 'utf8');
      let index = 0;
      while (true) {
        index = css.indexOf('@apply', index);
        if (index === -1) break;
        console.log('Match found at index:', index);
        console.log(css.substring(Math.max(0, index - 100), Math.min(css.length, index + 200)));
        index += 6;
      }
    `;
    const runScript = await ssh.execCommand(`node -e "${script.replace(/"/g, '\\"')}"`);
    console.log('--- NODE EXTRACTED MATCHES ---');
    console.log(runScript.stdout || runScript.stderr);

  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    ssh.dispose();
  }
}
run();
