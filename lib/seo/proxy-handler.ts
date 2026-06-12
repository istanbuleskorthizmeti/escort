import axios from 'axios';
import { proxyCheapService } from './proxy-cheap-api';

/**
 * 🐉 DRKCNAY ELITE: PROXY HANDLER (VIP Elite v3.0)
 * Centralized rotating proxy engine supporting 7 select strategies with strict OPSEC.
 */

export interface ProxyMetrics {
  url: string;
  latencyMs: number;
  successCount: number;
  failCount: number;
  useCount: number;
  geo?: string;
  weight: number;
}

const proxyStore: Map<string, ProxyMetrics> = new Map();
let lastRotationTime = 0;
const ROTATION_COOLDOWN = 120000; // 2 minutes in ms
let roundRobinIndex = 0;

// Initialize proxies list from environment
function getProxyList(): string[] {
  const rawList = process.env.PROXY_LIST || '';
  const list = rawList.split(',').map(p => p.trim()).filter(Boolean);
  const base = process.env.PREMIUM_PROXY_URL || '';
  if (base && !list.includes(base)) {
    list.unshift(base);
  }
  return list;
}

// Ensure store is populated
function syncProxyStore() {
  const list = getProxyList();
  for (const url of list) {
    if (!proxyStore.has(url)) {
      proxyStore.set(url, {
        url,
        latencyMs: 100, // default good latency
        successCount: 1,
        failCount: 0,
        useCount: 0,
        geo: url.includes('tr') || url.includes('turkey') ? 'TR' : 'US',
        weight: 100
      });
    }
  }
}

export const ProxyHandler = {
  /**
   * Tracks latency and success/fail metrics for a proxy
   */
  reportMetrics(url: string, latencyMs: number, success: boolean) {
    const metrics = proxyStore.get(url);
    if (metrics) {
      metrics.useCount++;
      if (success) {
        metrics.successCount++;
        metrics.latencyMs = Math.round((metrics.latencyMs * 0.7) + (latencyMs * 0.3));
        metrics.weight = Math.min(200, metrics.weight + 5);
      } else {
        metrics.failCount++;
        metrics.weight = Math.max(10, metrics.weight - 20);
      }
    }
  },

  /**
   * 🎰 SELECT STRATEGY (7 Choices)
   * Stratejiler: weighted, fastest, success-rate, geo, round-robin, random, least-used
   */
  getProxyUrl(strategyOrRotate: boolean | 'weighted' | 'fastest' | 'success-rate' | 'geo' | 'round-robin' | 'random' | 'least-used' = 'weighted', targetGeo?: string): string | null {
    syncProxyStore();
    const proxies = Array.from(proxyStore.values());
    if (proxies.length === 0) return null;

    let selected: ProxyMetrics | null = null;
    let strategy = strategyOrRotate;
    if (typeof strategy === 'boolean') {
      strategy = strategy ? 'random' : 'weighted';
    }

    switch (strategy) {
      case 'fastest':
        selected = proxies.reduce((prev, curr) => prev.latencyMs < curr.latencyMs ? prev : curr);
        break;

      case 'success-rate':
        selected = proxies.reduce((prev, curr) => {
          const prevRate = prev.successCount / (prev.successCount + prev.failCount || 1);
          const currRate = curr.successCount / (curr.successCount + curr.failCount || 1);
          return prevRate > currRate ? prev : curr;
        });
        break;

      case 'geo':
        const geoMatches = proxies.filter(p => p.geo === (targetGeo || 'TR'));
        if (geoMatches.length > 0) {
          selected = geoMatches[Math.floor(Math.random() * geoMatches.length)];
        } else {
          selected = proxies[Math.floor(Math.random() * proxies.length)]; // fallback
        }
        break;

      case 'round-robin':
        selected = proxies[roundRobinIndex % proxies.length];
        roundRobinIndex++;
        break;

      case 'random':
        selected = proxies[Math.floor(Math.random() * proxies.length)];
        break;

      case 'least-used':
        selected = proxies.reduce((prev, curr) => prev.useCount < curr.useCount ? prev : curr);
        break;

      case 'weighted':
      default:
        // Weighted selection
        const totalWeight = proxies.reduce((sum, p) => sum + p.weight, 0);
        let rand = Math.random() * totalWeight;
        for (const p of proxies) {
          rand -= p.weight;
          if (rand <= 0) {
            selected = p;
            break;
          }
        }
        if (!selected) selected = proxies[0];
        break;
    }

    if (!selected) return null;

    // Trigger Mobile IP rotation if Proxy-Cheap credentials are present and cooldown expired
    const now = Date.now();
    if (process.env.PROXY_CHEAP_ID && (now - lastRotationTime > ROTATION_COOLDOWN)) {
      lastRotationTime = now;
      console.log(`🔄 [PROXY-HANDLER] Cooldown expired. Rotating proxy: ${process.env.PROXY_CHEAP_ID}`);
      proxyCheapService.rotateIP(process.env.PROXY_CHEAP_ID).catch(() => {});
    }

    return proxyCheapService.getRotatingResidentialUrl(selected.url);
  },

  /**
   * 🛡️ OPSEC PROTECTED FETCH WITH METRICS
   */
  async proxyFetch(url: string, options: Record<string, unknown> = {}, rotate = false) {
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
    const proxyUrl = isLocal ? null : this.getProxyUrl(rotate ? 'random' : 'weighted');
    const forceProxy = !isLocal && (process.env.FORCE_PROXY === 'true' || !!proxyUrl);

    const headers = (options.headers as Record<string, string>) || {};
    const axiosConfig: Record<string, unknown> = {
      url,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...headers
      },
      data: options.body || options.data,
      timeout: (options.timeout as number) || 30000,
    };

    if (proxyUrl) {
      try {
        const urlObj = new URL(proxyUrl);
        axiosConfig.proxy = {
          protocol: urlObj.protocol.replace(':', ''),
          host: urlObj.hostname,
          port: parseInt(urlObj.port),
          auth: {
            username: urlObj.username,
            password: urlObj.password
          }
        };
      } catch (e) {
        console.error("❌ [PROXY-HANDLER] Malformed Proxy URL!");
        if (forceProxy) throw new Error("Blocked for OPSEC: Malformed proxy URL in strict mode.");
      }
    }

    const start = Date.now();
    try {
      const response = await axios(axiosConfig);
      const latency = Date.now() - start;
      if (proxyUrl) this.reportMetrics(proxyUrl, latency, true);

      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
        json: async () => response.data,
        text: async () => typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      };
    } catch (err: unknown) {
      const latency = Date.now() - start;
      const errorMsg = (err as Error).message || '';
      console.warn(`⚠️ [PROXY-HANDLER] Connection Issue: ${errorMsg}`);
      
      if (proxyUrl) this.reportMetrics(proxyUrl, latency, false);

      if (forceProxy) {
        console.error(`🚨 [OPSEC BLOCK] Strict mode active. Request blocked to prevent IP leak: ${url}`);
        throw new Error(`Proxy failure for ${url}. Connection dropped for safety.`);
      }

      throw err;
    }
  },

  /**
   * 🛰️ GET HTTPS PROXY AGENT
   */
  getAgent() {
    const proxyUrl = this.getProxyUrl('weighted');
    if (!proxyUrl) return null;
    try {
      const { HttpsProxyAgent } = require('https-proxy-agent');
      return new HttpsProxyAgent(proxyUrl);
    } catch (e) {
      console.error("❌ [PROXY-HANDLER] Failed to initialize HttpsProxyAgent:", e);
      return null;
    }
  }
};
