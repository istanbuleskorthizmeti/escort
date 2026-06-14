const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
  try {
    await ssh.connect({
      host: '213.232.235.181',
      port: 2222,
      username: 'root',
      password: '5TVuj6qiHMfh8CxH9O!'
    });

    console.log('--- Testing Sitemap Generation on Server ---');

    // Test command: Execute sitemap route handler or helper directly on server
    const cmd = `node -e "
const { generateSitemapResponse } = require('./lib/seo/sitemap-generator');
async function test() {
  // Test Case 1: Main domain
  const res1 = await generateSitemapResponse('istanbulescort.blog', 'sitemap.xml');
  const xml1 = await res1.text();
  const count1 = (xml1.match(/<url>/g) || []).length;
  console.log('istanbulescort.blog sitemap entries count:', count1);

  // Test Case 2: Satellite domain targeting Esenyurt
  const res2 = await generateSitemapResponse('esenyurtescorthizmeti.shop', 'sitemap.xml');
  const xml2 = await res2.text();
  const count2 = (xml2.match(/<url>/g) || []).length;
  console.log('esenyurtescorthizmeti.shop sitemap entries count:', count2);
  
  // Show a few urls from the satellite sitemap
  const urls = xml2.match(/<loc>(.*?)<\\/loc>/g) || [];
  console.log('First 5 URLs from esenyurtescorthizmeti.shop:');
  urls.slice(0, 5).forEach(u => console.log('  ' + u));
}
test().catch(console.error);
"`;

    const res = await ssh.execCommand(cmd, { cwd: '/root/esc' });
    console.log(res.stdout || res.stderr);

  } catch(e) {
    console.error(e);
  } finally {
    ssh.dispose();
  }
}
run();
