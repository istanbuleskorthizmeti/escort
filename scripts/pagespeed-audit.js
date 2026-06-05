const axios = require('axios');

const SITES = [
  'istanbulescort.blog',
  'istanbulescdrkcn.com',
  'escortvip.net',
  'vipescorthizmeti.shop',
  'bagcilarescort.shop',
  'esenyurtescort.blog'
];

async function checkSpeed(domain) {
  try {
    const url = `https://${domain}`;
    console.log(`Checking Speed for: ${url}`);
    
    const fs = require('fs');
    let apiKey = '';
    try {
      const dotenvContent = fs.readFileSync('.env', 'utf8');
      const match = dotenvContent.match(/GOOGLE_API_KEY=["']?([^"'\r\n]+)/);
      if (match) apiKey = match[1];
    } catch(e) {}

    // Call PageSpeed Insights API with Key
    const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&strategy=mobile${apiKey ? `&key=${apiKey}` : ''}`;
    const response = await axios.get(apiEndpoint);
    
    const performanceScore = response.data.lighthouseResult.categories.performance.score * 100;
    const fcp = response.data.lighthouseResult.audits['first-contentful-paint'].displayValue;
    const lcp = response.data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    const tbt = response.data.lighthouseResult.audits['total-blocking-time'].displayValue;
    const cls = response.data.lighthouseResult.audits['cumulative-layout-shift'].displayValue;
    
    console.log(`--- [${domain}] Mobile Performance Report ---`);
    console.log(`Score: ${performanceScore}/100`);
    console.log(`First Contentful Paint (FCP): ${fcp}`);
    console.log(`Largest Contentful Paint (LCP): ${lcp}`);
    console.log(`Total Blocking Time (TBT): ${tbt}`);
    console.log(`Cumulative Layout Shift (CLS): ${cls}`);
    console.log('-------------------------------------------\n');
  } catch (error) {
    console.error(`Error checking speed for ${domain}:`, error.message);
  }
}

async function runAll() {
  for (const site of SITES) {
    await checkSpeed(site);
    // Wait to avoid rate limits
    await new Promise(r => setTimeout(r, 2000));
  }
}

runAll();
