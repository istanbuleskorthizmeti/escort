/**
 * 🕵️‍♂️ DRKCNAY PROXY-CHEAP API SERVICE
 * High-performance management for residential and mobile proxies.
 */

class ProxyCheapService {
  private baseURL = 'https://api.proxy-cheap.com';

  private getHeaders() {
    const key = process.env.PROXY_CHEAP_API_KEY || '';
    const secret = process.env.PROXY_CHEAP_API_SECRET || '';
    
    if (!key || !secret) {
      console.warn("⚠️ [PROXY-CHEAP] Missing API Key or Secret in environment!");
    } else {
      console.log(`📡 [PROXY-CHEAP] Using Key: ${key.substring(0, 4)}...${key.substring(key.length - 4)}`);
    }

    return {
      'X-Api-Key': key,
      'X-Api-Secret': secret,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Fetches all proxies associated with the account.
   */
  async getProxies() {
    try {
      const url = `${this.baseURL}/proxies`;
      const response = await fetch(url, {
        headers: this.getHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.warn(`❌ [PROXY-CHEAP] API Error [${response.status}]: ${JSON.stringify(data)}`);
        return [];
      }

      // Handle different possible response formats
      if (Array.isArray(data)) return data;
      if (data.proxies && Array.isArray(data.proxies)) return data.proxies;
      if (data.data && Array.isArray(data.data)) return data.data;
      
      return [];
    } catch (error: any) {
      console.error('❌ [PROXY-CHEAP] System Error:', error.message);
      return [];
    }
  }

  /**
   * Rotates the IP of a specific proxy (V2 API standard).
   */
  async rotateIP(proxyId: string) {
    try {
      // Documentation says: POST https://api.proxy-cheap.com/v2/proxies/{proxyId}/rotate
      const response = await fetch(`${this.baseURL}/v2/proxies/${proxyId}/rotate`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      const data = await response.json();
      console.log(`🔄 [PROXY-CHEAP] IP rotated via V2 for proxy ${proxyId}`);
      return data;
    } catch (error: any) {
      console.error(`❌ [PROXY-CHEAP] Failed to rotate IP for ${proxyId}:`, error.message);
      return null;
    }
  }

  /**
   * Checks bandwidth and status of a proxy (V2 API).
   */
  async getProxyDetails(proxyId: string) {
    try {
      const response = await fetch(`${this.baseURL}/v2/proxies/${proxyId}`, {
        headers: this.getHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(`❌ [PROXY-CHEAP] Failed to get details for ${proxyId}:`, error.message);
      return null;
    }
  }

  /**
   * Utility to generate a unique session-based residential proxy URL.
   * Based on docs: Uses unique session tokens in the username.
   */
  getRotatingResidentialUrl(baseUrl: string) {
    if (!baseUrl) return null;
    
    try {
        const url = new URL(baseUrl);
        const auth = url.username;
        
        // If it's a residential proxy, we can append a session ID to the username
        // Pattern: [username]-session-[uuid]
        if (auth && !auth.includes('-session-')) {
          const sessionId = Math.random().toString(36).substring(2, 10);
          url.username = `${auth}-session-${sessionId}`;
        }
        
        return url.toString();
    } catch (e) {
        return baseUrl;
    }
  }
}

export const proxyCheapService = new ProxyCheapService();

