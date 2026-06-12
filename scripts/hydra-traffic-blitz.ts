/**
 * 🧛‍♂️ DRKCNAY ELITE: HYDRA TRAFFIC BLITZ ENGINE (v3.0)
 * Advanced multi-threaded Stealth CTR & Traffic Simulation Suite.
 * Fully features anti-detection, behavior profiles, GSC queries, and proxy metrics.
 */

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ProxyHandler } from '../lib/seo/proxy-handler';
import { TelegramService } from '../lib/crm/telegram';
import { DEVICE_PROFILES, BEHAVIOR_PROFILES, injectStealthScripts, BehaviorType } from '../lib/seo/stealth-profile';

puppeteer.use(StealthPlugin());

// Config Hot-Reload parameters
interface Config {
  targetDomain: string;
  maxConcurrency: number;
  encryptionKey: string;
  prometheusFile: string;
  sessionFile: string;
}

function loadConfig(): Config {
  return {
    targetDomain: process.env.SITE_DOMAIN || 'istanbulescort.blog',
    maxConcurrency: Math.min(50, parseInt(process.env.TRAFFIC_CONCURRENCY || '5')),
    encryptionKey: process.env.SESSION_ENCRYPTION_KEY || 'drkcnay-ultra-secret-key-32-chars!',
    prometheusFile: path.join(process.cwd(), 'public', 'metrics.json'),
    sessionFile: path.join(process.cwd(), 'scratch', 'hydra-sessions.json')
  };
}

// Prometheus metrics store
const metrics = {
  totalVisits: 0,
  successfulVisits: 0,
  failedVisits: 0,
  qualityScores: [] as string[],
  activeThreads: 0,
  startTime: Date.now()
};

// Simple AES-256-GCM Session Encryptor
function encryptData(data: string, key: string): string {
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key.substring(0, 32)), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch {
    return data;
  }
}

function decryptData(data: string, key: string): string {
  try {
    const [ivHex, authTagHex, encryptedHex] = data.split(':');
    if (!ivHex || !authTagHex || !encryptedHex) return '{}';
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key.substring(0, 32)), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return '{}';
  }
}

// Fetch organic target keywords (GSC export or static list)
function getTargetKeywords(): string[] {
  const gscPath = path.join(process.cwd(), 'GSC_FULL_QUERIES.json');
  if (fs.existsSync(gscPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(gscPath, 'utf8'));
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 25).map((row: any) => row.keys?.[0] as string).filter(Boolean);
      }
    } catch { /* fallback */ }
  }
  return [
    'istanbul vip escort', 'kaporasız escort istanbul', 'beşiktaş elit escort',
    'şişli escort ajansı', 'istanbul güvenilir escort', 'şişli vip escort'
  ];
}

async function simulateVisit(threadId: number, config: Config) {
  const proxyUrl = ProxyHandler.getProxyUrl('weighted', 'TR');
  const device = DEVICE_PROFILES[Math.floor(Math.random() * DEVICE_PROFILES.length)];
  const behaviorKeys = Object.keys(BEHAVIOR_PROFILES) as BehaviorType[];
  const behavior = BEHAVIOR_PROFILES[behaviorKeys[Math.floor(Math.random() * behaviorKeys.length)]];
  const keyword = getTargetKeywords()[Math.floor(Math.random() * getTargetKeywords().length)];

  console.log(`🧵 [THREAD-${threadId}] [${behavior.name}] -> Proxy: ${proxyUrl ? 'Active' : 'Direct'} | Device: ${device.name}`);
  metrics.activeThreads++;

  const launchArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-blink-features=AutomationControlled',
    '--disable-tls-13-kyber' // TLS randomization hint
  ];

  if (proxyUrl) {
    try {
      const server = new URL(proxyUrl).host;
      launchArgs.push(`--proxy-server=http://${server}`);
    } catch { /* noop */ }
  }

  const browser = await puppeteer.launch({ headless: true, args: launchArgs });
  let qualityScore = 'F';

  try {
    const page = await browser.newPage();
    await page.setUserAgent(device.userAgent);
    await page.setViewport({ width: device.width, height: device.height, deviceScaleFactor: device.deviceScaleFactor });

    // Inject anti-detect & fingerprint noise overrides
    await page.evaluateOnNewDocument(injectStealthScripts());

    // Basic session cookie loading
    if (fs.existsSync(config.sessionFile) && Math.random() > 0.4) {
      try {
        const raw = fs.readFileSync(config.sessionFile, 'utf8');
        const decrypted = JSON.parse(decryptData(raw, config.encryptionKey));
        if (decrypted.cookies) await page.setCookie(...decrypted.cookies);
      } catch { /* noop */ }
    }

    // Go to Google Search
    await page.goto('https://www.google.com.tr', { waitUntil: 'networkidle2', timeout: 45000 });
    
    // Cookie Accept (Google Europe/Turkey consent screen)
    try {
      const consentBtn = await page.$('button#L2AGLb');
      if (consentBtn) await consentBtn.click();
    } catch { /* noop */ }

    // Type query naturally
    await page.waitForSelector('textarea[name="q"]', { timeout: 10000 });
    await page.type('textarea[name="q"]', keyword, { delay: Math.floor(Math.random() * 80) + 70 });
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

    // Search results scan
    const foundLink = await page.evaluate((domain) => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const target = anchors.find(a => a.href && a.href.includes(domain));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return target.href;
      }
      return null;
    }, config.targetDomain);

    if (foundLink) {
      console.log(`🎯 [THREAD-${threadId}] Found target URL: ${foundLink}`);
      // Click through standard RankBrain bypass
      await page.evaluate((domain) => {
        const anchors = Array.from(document.querySelectorAll('a'));
        const target = anchors.find(a => a.href && a.href.includes(domain));
        if (target) target.click();
      }, config.targetDomain);

      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
      
      // Dynamic behavior simulation (page depth + dwell time)
      const depth = Math.floor(Math.random() * (behavior.pageDepth[1] - behavior.pageDepth[0] + 1)) + behavior.pageDepth[0];
      const dwell = Math.floor(Math.random() * (behavior.dwellTimeMs[1] - behavior.dwellTimeMs[0] + 1)) + behavior.dwellTimeMs[0];
      
      console.log(`⏳ [THREAD-${threadId}] Simulating ${depth} pages over ${Math.round(dwell/1000)}s...`);
      
      for (let p = 0; p < depth; p++) {
        // Human scrolling
        await page.evaluate(() => {
          window.scrollBy(0, Math.random() * 400);
        });
        await new Promise(r => setTimeout(r, Math.round(dwell / depth)));

        // Select next inner anchor if depth > 1
        if (p < depth - 1) {
          try {
            await page.evaluate(() => {
              const inner = Array.from(document.querySelectorAll('a')).filter(a => a.href && a.href.includes(window.location.hostname));
              if (inner.length > 0) inner[Math.floor(Math.random() * inner.length)].click();
            });
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});
          } catch { /* break early */ }
        }
      }

      qualityScore = depth >= 3 ? 'A+' : depth >= 2 ? 'B' : 'C';
      metrics.successfulVisits++;

      // Save cookie session persistency
      const cookies = await page.cookies();
      const encryptedSession = encryptData(JSON.stringify({ cookies }), config.encryptionKey);
      fs.writeFileSync(config.sessionFile, encryptedSession);
    } else {
      console.log(`⚠️ [THREAD-${threadId}] Target domain not visible in current SERP page.`);
      qualityScore = 'D';
      metrics.failedVisits++;
    }

  } catch (err: any) {
    console.error(`❌ [THREAD-${threadId}] Error:`, err.message);
    metrics.failedVisits++;
  } finally {
    await browser.close();
    metrics.activeThreads--;
    metrics.totalVisits++;
    metrics.qualityScores.push(qualityScore);
    writePrometheusMetrics(config);
  }
}

function writePrometheusMetrics(config: Config) {
  const data = {
    uptime_seconds: Math.round((Date.now() - metrics.startTime) / 1000),
    hydra_total_visits: metrics.totalVisits,
    hydra_successful_visits: metrics.successfulVisits,
    hydra_failed_visits: metrics.failedVisits,
    hydra_success_ratio: metrics.totalVisits > 0 ? (metrics.successfulVisits / metrics.totalVisits) : 0,
    hydra_active_threads: metrics.activeThreads,
    last_quality_score: metrics.qualityScores[metrics.qualityScores.length - 1] || 'N/A'
  };
  try {
    fs.mkdirSync(path.dirname(config.prometheusFile), { recursive: true });
    fs.writeFileSync(config.prometheusFile, JSON.stringify(data, null, 2));
  } catch { /* noop */ }
}

async function startEngine() {
  console.log("🧛‍♂️ [HYDRA-BLITZ] Booting traffic blitz engine...");
  while (true) {
    const config = loadConfig();
    const tasks: Promise<void>[] = [];

    // Master-worker concurrency manager
    for (let i = 0; i < config.maxConcurrency; i++) {
      tasks.push(simulateVisit(i + 1, config));
      await new Promise(r => setTimeout(r, 5000)); // stagger starts
    }

    await Promise.all(tasks);
    
    // Configurable cool-down
    const cooldown = 180 + Math.random() * 120;
    console.log(`😴 Cycle complete. Cooling down for ${Math.round(cooldown)}s...`);
    await new Promise(r => setTimeout(r, cooldown * 1000));
  }
}

// Trigger loop
if (require.main === module) {
  startEngine().catch(console.error);
}
export { simulateVisit, metrics };
