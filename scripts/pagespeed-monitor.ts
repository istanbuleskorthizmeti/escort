import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DOMAIN_MATRIX } from '../config/domains';

dotenv.config();

/**
 * 🧛‍♂️ DRKCNAY GOD-MODE PAGESPEED ANALYZER (v2.0)
 * Uses Google PageSpeed Insights API to monitor performance across the network.
 * Zero-tolerance for scores below 95.
 */

const API_KEY = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || '';

interface SpeedMetrics {
  score: number;
  fcp: string;
  lcp: string;
  tbt: string;
  cls: string;
}

interface DomainReport {
  domain: string;
  mobile: SpeedMetrics | null;
  desktop: SpeedMetrics | null;
  timestamp: string;
}

async function runPageSpeedTest(url: string, strategy: 'mobile' | 'desktop'): Promise<SpeedMetrics | null> {
  console.log(`📡 Querying PageSpeed Insights API for ${url} (${strategy})...`);
  try {
    const response = await axios.get(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed`, {
      params: {
        url: `https://${url}`,
        strategy,
        category: 'performance',
        ...(API_KEY ? { key: API_KEY } : {})
      },
      timeout: 60000 // 60s timeout
    });

    const categories = response.data?.lighthouseResult?.categories;
    const audits = response.data?.lighthouseResult?.audits;

    if (!categories || !audits) {
      throw new Error('Malformed API response');
    }

    const score = Math.round((categories.performance?.score || 0) * 100);
    const fcp = audits['first-contentful-paint']?.displayValue || 'N/A';
    const lcp = audits['largest-contentful-paint']?.displayValue || 'N/A';
    const tbt = audits['total-blocking-time']?.displayValue || 'N/A';
    const cls = audits['cumulative-layout-shift']?.displayValue || 'N/A';

    return { score, fcp, lcp, tbt, cls };
  } catch (error: any) {
    console.error(`❌ Failed to analyze ${url} (${strategy}):`, error.message);
    return null;
  }
}

async function startDominatorAnalysis() {
  console.log('🧛‍♂️ starting Hydra Fleet Performance Audit...');
  
  // Get domains to check: if CLI arg provided, check that; otherwise, check money sites + top satellites
  let targetHosts: string[] = [];
  const argHost = process.argv[2];

  if (argHost) {
    targetHosts = [argHost];
    console.log(`🎯 Targeted mode: Checking single host -> ${argHost}`);
  } else {
    // Check all money sites + first 3 satellites to avoid rate limit spamming
    const moneySites = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE').map(d => d.host);
    const satellites = DOMAIN_MATRIX.filter(d => d.role === 'SATELLITE').slice(0, 3).map(d => d.host);
    targetHosts = Array.from(new Set([...moneySites, ...satellites]));
    console.log(`📋 Fleet mode: Checking ${targetHosts.length} primary nodes`);
  }

  const reports: DomainReport[] = [];
  
  for (const domain of targetHosts) {
    console.log(`\n--- [Analyzing Domain: ${domain}] ---`);
    const mobile = await runPageSpeedTest(domain, 'mobile');
    // Wait between calls to prevent Google API rate limits
    await new Promise(r => setTimeout(r, 3000));
    const desktop = await runPageSpeedTest(domain, 'desktop');
    
    reports.push({
      domain,
      mobile,
      desktop,
      timestamp: new Date().toISOString()
    });

    // Console output for this domain
    if (mobile) {
      const statusText = mobile.score >= 95 ? '✅ EXCELLENT' : mobile.score >= 90 ? '⚠️ ACCEPTABLE' : '🚨 CRITICAL (SCORE UNDER 90)';
      console.log(`📱 Mobile Score: ${mobile.score}/100 (${statusText})`);
      console.log(`   LCP: ${mobile.lcp} | TBT: ${mobile.tbt} | CLS: ${mobile.cls}`);
    } else {
      console.log('📱 Mobile Score: ❌ FAILED TO FETCH');
    }

    if (desktop) {
      console.log(`💻 Desktop Score: ${desktop.score}/100`);
      console.log(`   LCP: ${desktop.lcp} | TBT: ${desktop.tbt} | CLS: ${desktop.cls}`);
    } else {
      console.log('💻 Desktop Score: ❌ FAILED TO FETCH');
    }

    // Wait between domains to be gentle to the API
    await new Promise(r => setTimeout(r, 4000));
  }

  // Write JSON report
  const reportPath = path.join(process.cwd(), 'PAGESPEED_NETWORK_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(reports, null, 2));
  console.log(`\n🏁 Global Performance Report Generated: ${reportPath}`);

  // God Mode verification check
  console.log('\n--- 📊 God-Mode Performance Summary ---');
  let cleanSuccess = true;
  reports.forEach(r => {
    if (r.mobile) {
      if (r.mobile.score < 95) {
        console.log(`🚨 Domain [${r.domain}] mobile performance is sub-optimal: ${r.mobile.score}/100`);
        cleanSuccess = false;
      } else {
        console.log(`✅ Domain [${r.domain}] mobile performance is verified: ${r.mobile.score}/100`);
      }
    } else {
      console.log(`⚠️ Domain [${r.domain}] mobile performance could not be verified.`);
      cleanSuccess = false;
    }
  });

  if (cleanSuccess) {
    console.log('\n👑 GOD-MODE STATUS: ALL SITES ARE AT +95 PERFORMANCE! EXCELLENT WORK.');
  } else {
    console.log('\n⚠️ GOD-MODE STATUS: Some sites require further image/asset optimization or caching adjustments.');
  }
}

if (!API_KEY) {
  console.warn('⚠️ No PAGESPEED_API_KEY or GOOGLE_API_KEY found in .env. Results will be rate-limited.');
}

startDominatorAnalysis();
