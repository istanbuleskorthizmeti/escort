const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

(async () => {
  try {
    await ssh.connect({
      host: '187.77.111.203',
      username: 'root',
      password: 'Z4-nN8JfiUIh5,;g'
    });

    const result = await ssh.execCommand('curl -s -H "Host: istanbulescort.blog" "http://localhost/amp"');
    const html = result.stdout;

    const countOccurrences = (str, sub) => (str.split(sub).length - 1);

    let report = '';
    report += `link rel="canonical" occurrences: ${countOccurrences(html, 'rel="canonical"')}\n`;
    report += `meta charset occurrences: ${countOccurrences(html, 'charset=')}\n`;
    report += `meta name="viewport" occurrences: ${countOccurrences(html, 'name="viewport"')}\n`;
    report += `style amp-boilerplate occurrences: ${countOccurrences(html, 'amp-boilerplate')}\n`;
    report += `script tags count: ${countOccurrences(html, '<script')}\n`;
    report += `amp-img count: ${countOccurrences(html, '<amp-img')}\n`;
    report += `amp-custom style tags count: ${countOccurrences(html, 'amp-custom')}\n`;
    
    // Find all instances of canonical, charset, viewport in the HTML to see where they are
    const lines = html.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('canonical') || line.includes('viewport') || line.includes('charset') || (line.includes('<script') && !line.includes('application/ld+json') && !line.includes('ampproject.org'))) {
        report += `Line ${idx + 1}: ${line.trim()}\n`;
      }
    });

    fs.writeFileSync('scratch/inspect_amp_result.txt', report, 'utf8');
    console.log('Wrote results to scratch/inspect_amp_result.txt');
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
})();
