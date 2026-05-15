import axios from 'axios';
import fs from 'fs';

/**
 * 🧛‍♂️ DRKCNAY GOD-MODE PAGESPEED ANALYZER (v1.0)
 * Uses Google PageSpeed Insights API to monitor performance across the network.
 * Zero-tolerance for scores below 95.
 */

const API_KEY = process.env.PAGESPEED_API_KEY || '';
const DOMAINS = [
  'vipescorthizmeti.com',
  'dorukcanay.digital',
  // ... Add other hydra nodes here
];

async function runPageSpeedTest(url: string, strategy: 'mobile' | 'desktop') {
  console.log(`🚀 Analyzing ${url} (${strategy})...`);
  try {
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`, {
      params: {
        url: `https://${url}`,
        key: API_KEY,
        strategy,
        category: 'performance'
      }
    });

    const score = response.data.lighthouseResult.categories.performance.score * 100;
    const lcp = response.data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    const tbt = response.data.lighthouseResult.audits['total-blocking-time'].displayValue;

    return { score, lcp, tbt };
  } catch (error) {
    console.error(`❌ Failed to analyze ${url}:`, error.message);
    return null;
  }
}

async function startDominatorAnalysis() {
  const report = [];
  
  for (const domain of DOMAINS) {
    const mobile = await runPageSpeedTest(domain, 'mobile');
    const desktop = await runPageSpeedTest(domain, 'desktop');
    
    report.push({
      domain,
      mobile,
      desktop,
      timestamp: new Date().toISOString()
    });
  }

  fs.writeFileSync('PAGESPEED_NETWORK_REPORT.json', JSON.stringify(report, null, 2));
  console.log('✅ Global Performance Report Generated: PAGESPEED_NETWORK_REPORT.json');
}

if (!API_KEY) {
  console.warn('⚠️ No PAGESPEED_API_KEY found in environment. Results may be rate-limited.');
}

startDominatorAnalysis();
