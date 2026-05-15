const { googleAuth } = require('../lib/google-auth');
const { DOMAIN_MATRIX } = require('../config/domains');

async function submitAllSitemaps() {
  console.log('📡 [HYDRA] Starting Global Sitemap Submission...');
  
  const targets = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE');

  for (const site of targets) {
    const siteUrl = `https://${site.host}/`;
    const sitemapUrl = `${siteUrl}sitemap.xml`;
    
    console.log(`🌍 [SUBMIT] Domain: ${site.host}`);
    
    // First, try to submit
    const success = await googleAuth.submitSitemap(siteUrl, sitemapUrl);
    
    if (success) {
      console.log(`   ✅ Submitted: ${sitemapUrl}`);
    } else {
      console.log(`   ❌ Failed: ${site.host} (Ensure Service Account is added as user in GSC)`);
    }
  }

  console.log('\n🏆 [DONE] Global Sitemap Submission Task Completed!');
}

submitAllSitemaps();
