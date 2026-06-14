import axios from 'axios';
import { DOMAIN_MATRIX } from '../config/domains';

/**
 * ⚡ HYDRA PAGESPEED AUDITOR v1.0
 * Uses Google PageSpeed Insights API to verify "God Mode" performance.
 */
async function main() {
  const apiKey = process.env.GOOGLE_API_KEY || ''; // Optional but recommended
  const targets = [
    'https://istanbulescort.blog',
    'https://escortvip.net',
    'https://bagcilarescort.shop',
    'https://esenyurtescort.blog'
  ];

  console.log('🏁 [HYDRA] Starting PageSpeed Audit...');
  console.log('🛡️  Optimization Check: Frankfurt Edge v5 active.');

  for (const url of targets) {
    console.log(`\n🔍 Auditing: ${url}...`);
    try {
      const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;
      const res = await axios.get(endpoint);
      
      const score = res.data.lighthouseResult.categories.performance.score * 100;
      const fcp = res.data.lighthouseResult.audits['first-contentful-paint'].displayValue;
      const lcp = res.data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
      const cls = res.data.lighthouseResult.audits['cumulative-layout-shift'].displayValue;

      console.log(`✅ [SCORE] ${score}/100`);
      console.log(`- FCP: ${fcp}`);
      console.log(`- LCP: ${lcp}`);
      console.log(`- CLS: ${cls}`);

      if (score > 90) {
        console.log('🚀 STATUS: ELITE SPEED DETECTED');
      } else {
        console.warn('⚠️ STATUS: OPTIMIZATION REQUIRED');
      }
    } catch (e: any) {
      console.error(`❌ [ERROR] Failed to audit ${url}:`, e.response?.data?.error?.message || e.message);
      console.log('💡 Tip: GCloud quota or missing API key might be the cause.');
    }
    
    // PageSpeed is slow, wait
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
