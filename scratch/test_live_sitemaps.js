const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

async function run() {
  let output = '--- Testing Live Sitemaps & Canonical Tags ---\n\n';
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    // 1. Get Esenyurt sitemap
    console.log('Fetching Esenyurt sitemap...');
    const esenyurtSitemap = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/sitemap.xml');
    output += '=== esenyurtescorthizmeti.shop/sitemap.xml ===\n';
    output += esenyurtSitemap.stdout.trim() + '\n\n';

    // 2. Get Besiktas sitemap
    console.log('Fetching Besiktas sitemap...');
    const besiktasSitemap = await ssh.execCommand('curl -s -H "Host: besiktasescorthizmeti.shop" http://localhost:3001/sitemap.xml');
    output += '=== besiktasescorthizmeti.shop/sitemap.xml ===\n';
    output += besiktasSitemap.stdout.trim() + '\n\n';

    // 3. Check canonicals on target vs non-target district pages for Esenyurt
    console.log('Checking canonicals...');
    
    // Target page: /istanbul/esenyurt on esenyurtescorthizmeti.shop
    const esenyurtTarget = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/esenyurt | grep -E "canonical|robots"');
    output += '=== esenyurtescorthizmeti.shop/istanbul/esenyurt ===\n';
    output += esenyurtTarget.stdout.trim() + '\n\n';

    // Non-target page: /istanbul/besiktas on esenyurtescorthizmeti.shop (should point canonical to besiktasescorthizmeti.shop and contain noindex)
    const esenyurtNonTarget = await ssh.execCommand('curl -s -H "Host: esenyurtescorthizmeti.shop" http://localhost:3001/istanbul/besiktas | grep -E "canonical|robots"');
    output += '=== esenyurtescorthizmeti.shop/istanbul/besiktas (Non-Target) ===\n';
    output += esenyurtNonTarget.stdout.trim() + '\n\n';

  } catch(e) {
    output += `Error: ${e.message}\n`;
  } finally {
    ssh.dispose();
    fs.writeFileSync('scratch/live_sitemaps_output.txt', output);
    console.log('Saved output to scratch/live_sitemaps_output.txt');
  }
}
run();
