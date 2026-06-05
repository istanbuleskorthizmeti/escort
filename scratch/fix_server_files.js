const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });
    console.log('--- Deleting conflicting server sitemap.ts ---');
    const delSitemap = await ssh.execCommand('rm -f /var/www/escortvip/app/sitemap.ts');
    console.log(delSitemap.stdout || delSitemap.stderr || 'sitemap.ts deleted.');

    console.log('--- Deleting conflicting server amp/page.tsx ---');
    const delAmp = await ssh.execCommand('rm -f /var/www/escortvip/app/amp/page.tsx');
    console.log(delAmp.stdout || delAmp.stderr || 'amp/page.tsx deleted.');

    console.log('--- Fixing layout.tsx speculation rules syntax on Server ---');
    const fixLayout = await ssh.execCommand(
      `node -e "
        const fs = require('fs');
        const file = '/var/www/escortvip/app/layout.tsx';
        let content = fs.readFileSync(file, 'utf8');
        const badScript = '<script type=\\\"speculationrules\\\">{\\\"prerender\\\":[{\\\"source\\\":\\\"list\\\",\\\"urls\\\":[\\\"/\\\"]}]}</script>';
        const goodScript = '<script type=\\\"speculationrules\\\" dangerouslySetInnerHTML={{ __html: JSON.stringify({ prerender: [{ source: \\\"list\\\", urls: [\\\"/\\\"] }] }) }} />';
        if (content.includes(badScript)) {
          content = content.replace(badScript, goodScript);
          fs.writeFileSync(file, content, 'utf8');
          console.log('Successfully replaced speculation rules syntax.');
        } else {
          console.log('Bad script syntax not found in layout.tsx. Checking if already replaced or different.');
        }
      "`
    );
    console.log(fixLayout.stdout || fixLayout.stderr);

    console.log('--- Verifying files ---');
    const checkFiles = await ssh.execCommand('ls -l /var/www/escortvip/app/sitemap.ts /var/www/escortvip/app/amp/page.tsx 2>&1');
    console.log(checkFiles.stdout || checkFiles.stderr);
  } catch (e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
