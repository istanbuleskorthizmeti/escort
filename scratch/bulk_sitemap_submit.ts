import { DOMAIN_MATRIX } from '../config/domains';
import { GSCService } from '../lib/seo/gsc';

/**
 * 🚀 HYDRA BULK SITEMAP SUBMITTER
 * Iterates through all 56+ domains and forces Google to index them.
 */
async function main() {
  console.log('🏁 [HYDRA] Starting Bulk Sitemap Submission...');
  const gsc = GSCService.getInstance();
  
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const domain of DOMAIN_MATRIX) {
    const siteUrl = `https://${domain.host}/`;
    const sitemapUrl = `https://${domain.host}/sitemap.xml`;
    
    // Log active account for debug
    if (results.success === 0 && results.failed === 0) {
      console.log(`👤 [AUTH] Using service account: ${(gsc as any).auth?.email || 'OAuth2 / Unknown'}`);
    }

    // 🛡️ [CLOAKING] Add random delay to avoid Google's bot detection
    const delay = Math.floor(Math.random() * 3000) + 2000;
    console.log(`⏳ Waiting ${delay}ms before next submission...`);
    await new Promise(resolve => setTimeout(resolve, delay));

    try {
      const res = await gsc.submitSitemap(siteUrl, sitemapUrl);
      if (res.success) {
        console.log(`✅ [SUCCESS] Submitted: ${domain.host}`);
        results.success++;
      } else {
        console.warn(`⚠️ [WARNING] Failed to submit ${domain.host}: ${res.error}`);
        results.failed++;
        results.errors.push(`${domain.host}: ${res.error}`);
      }
    } catch (e: any) {
      console.error(`❌ [CRITICAL] Error for ${domain.host}:`, e.message);
      results.failed++;
      results.errors.push(`${domain.host}: ${e.message}`);
    }
    
    // Slow down to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n📊 [FINAL REPORT]');
  console.log(`- Success: ${results.success}`);
  console.log(`- Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n⚠️ ERRORS:');
    results.errors.forEach(err => console.log(`  - ${err}`));
  }
}

main().catch(console.error);
