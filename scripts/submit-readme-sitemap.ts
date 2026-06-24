import { googleAuth } from '../lib/google-auth';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  console.log('📡 Starting Sitemap Submission for ReadMe Portal...');

  // The site is a ReadMe portal domain
  const siteUrl = 'sc-domain:istanbul-eskort-hizmeti.readme.io';
  // Also try URL-prefixed format since some GSC configurations verify on the prefix
  const siteUrlPrefixed = 'https://istanbul-eskort-hizmeti.readme.io/';
  const sitemapUrl = 'https://istanbul-eskort-hizmeti.readme.io/sitemap.xml';

  console.log(`🌍 Target Sitemap: ${sitemapUrl}`);
  console.log(`🔑 Available Service Accounts: ${googleAuth.getServiceAccountCount()}`);

  if (googleAuth.getServiceAccountCount() === 0) {
    console.error('❌ No service accounts loaded. Verify google-key-*.json files exist in the project root.');
    process.exit(1);
  }

  // 1. Submit to sc-domain GSC Property
  console.log(`\n⏳ Attempting submission on property: ${siteUrl}...`);
  const successDomain = await googleAuth.submitSitemap(siteUrl, sitemapUrl);

  // 2. Submit to URL-prefixed GSC Property
  console.log(`\n⏳ Attempting submission on property: ${siteUrlPrefixed}...`);
  const successPrefixed = await googleAuth.submitSitemap(siteUrlPrefixed, sitemapUrl);

  if (successDomain || successPrefixed) {
    console.log('\n🎉 Sitemap submission task completed successfully!');
  } else {
    console.error('\n❌ Sitemap submission failed. Verify GSC permissions for service accounts.');
    process.exit(1);
  }
}

run().catch(console.error);
