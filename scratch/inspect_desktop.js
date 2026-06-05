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

    const result = await ssh.execCommand('curl -s -H "Host: istanbulescort.blog" "http://localhost/"');
    const html = result.stdout;

    const countOccurrences = (str, sub) => (str.split(sub).length - 1);

    let report = '';
    report += `Desktop page inspect:\n`;
    report += `link rel="canonical" occurrences: ${countOccurrences(html, 'rel="canonical"')}\n`;
    report += `meta charset occurrences: ${countOccurrences(html, 'charset=')}\n`;
    report += `meta name="viewport" occurrences: ${countOccurrences(html, 'name="viewport"')}\n`;
    report += `meta charset="utf-8" occurrences: ${countOccurrences(html, 'charset="utf-8"')}\n`;

    // Let's print out lines containing these
    const lines = html.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('canonical') || line.includes('viewport') || line.includes('charset')) {
        report += `Line ${idx + 1}: ${line.trim()}\n`;
      }
    });

    fs.writeFileSync('scratch/inspect_desktop_result.txt', report, 'utf8');
    console.log('Wrote results to scratch/inspect_desktop_result.txt');
    ssh.dispose();
  } catch (err) {
    console.error(err);
  }
})();
