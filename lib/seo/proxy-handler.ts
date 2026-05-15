import axios from 'axios';
import { proxyCheapService } from './proxy-cheap-api';

/**
 * 🐉 DRKCNAY ELITE: PROXY HANDLER (GOD MODE v2.1)
 * Provides centralized rotating residential proxy logic with strict OPSEC.
 */
let lastRotationTime = 0;
const ROTATION_COOLDOWN = 120000; // 2 minutes in ms

export const ProxyHandler = {
  getProxyUrl(rotate = false) {
    const baseUrl = process.env.PREMIUM_PROXY_URL || null;
    if (rotate && baseUrl) {
      return proxyCheapService.getRotatingResidentialUrl(baseUrl);
    }
    return baseUrl;
  },

  /**
   * 🛡️ OPSEC PROTECTED FETCH
   * Wraps axios to ensure no IP leaks happen if the proxy fails.
   */
  async proxyFetch(url: string, options: any = {}, rotate = false) {
    // 🏠 AUTO-SKIP FOR LOCALHOST
    const isLocal = url.includes('localhost') || url.includes('127.0.0.1');
    const proxyUrl = isLocal ? null : this.getProxyUrl(rotate);
    const forceProxy = !isLocal && (process.env.FORCE_PROXY === 'true' || !!proxyUrl);

    const axiosConfig: any = {
      url,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ...options.headers
      },
      data: options.body || options.data,
      timeout: options.timeout || 30000,
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

        // 🔄 MOBILE ROTATION TRIGGER (Throttled)
        const now = Date.now();
        if (rotate && process.env.PROXY_CHEAP_ID && (now - lastRotationTime > ROTATION_COOLDOWN)) {
            lastRotationTime = now;
            console.log(`🔄 [PROXY-HANDLER] Triggering throttled rotation for ID: ${process.env.PROXY_CHEAP_ID}`);
            proxyCheapService.rotateIP(process.env.PROXY_CHEAP_ID).catch(() => {});
        }

      } catch (e) {
        console.error("❌ [PROXY-HANDLER] Malformed Proxy URL!");
        if (forceProxy) throw new Error("Blocked for OPSEC: Malformed proxy URL in strict mode.");
      }
    }


    try {
      const response = await axios(axiosConfig);
      return {
        ok: response.status >= 200 && response.status < 300,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers,
        json: async () => response.data,
        text: async () => typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      };
    } catch (err: any) {
      const isProxyError = err.response?.status === 407 || err.response?.status === 401 || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT';
      
      if (isProxyError) {
        console.warn(`⚠️ [PROXY-HANDLER] Connection Issue (${err.code || err.response?.status}).`);
        
        if (forceProxy) {
          console.error(`🚨 [OPSEC BLOCK] Strict mode active. Request blocked to prevent IP leak: ${url}`);
          throw new Error(`Proxy failure for ${url}. Connection dropped for safety.`);
        }
      }

      if (err.response) {
        return { 
          ok: false, 
          status: err.response.status, 
          statusText: err.response.statusText, 
          data: err.response.data,
          json: async () => err.response.data, 
          text: async () => typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data) 
        };
      }
      
      throw err;
    }
  },

  /**
   * 🛰️ GET HTTPS PROXY AGENT
   * Returns a configured agent for libraries like googleapis or axios.
   */
  getAgent() {
    const proxyUrl = this.getProxyUrl();
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


