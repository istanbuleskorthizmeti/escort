
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CF_API_URL = 'https://api.cloudflare.com/client/v4';

/**
 * 🧛‍♂️ DRKCNAY HYDRA: CLOUDFLARE DNS MANAGER (v1.0)
 * Massive-scale DNS synchronization for the Sovereign Hydra network.
 */
export class CloudflareManager {
  private apiToken: string;
  private email: string;

  constructor() {
    this.apiToken = process.env.CF_API_TOKEN || '';
    this.email = process.env.CF_EMAIL || '';
    
    if (!this.apiToken) {
      console.error("❌ [CLOUDFLARE] API Token missing in .env");
    }
  }

  private get headers() {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Fetches all zones (domains) in the account.
   */
  async listZones() {
    try {
      const response = await axios.get(`${CF_API_URL}/zones?per_page=50`, { headers: this.headers });
      return response.data.result;
    } catch (error: any) {
      console.error("❌ [CLOUDFLARE] Failed to list zones:", error.response?.data || error.message);
      return [];
    }
  }

  /**
   * Synchronizes a single zone to the new IP and CLEANS UP old IPs (A & AAAA).
   */
  async syncZone(zoneId: string, zoneName: string, newIp: string) {
    try {
      console.log(`🌀 [CLOUDFLARE] Cleaning & Syncing records for ${zoneName}...`);
      
      // 1. Get ALL A and AAAA records
      const recordsRes = await axios.get(`${CF_API_URL}/zones/${zoneId}/dns_records`, { headers: this.headers });
      const records = recordsRes.data.result;

      // Track if we have at least one root A record for the new IP
      let hasNewIpRoot = false;

      for (const record of records) {
        // Handle A records
        if (record.type === 'A') {
          if (record.content === newIp) {
            console.log(`✅ [CLOUDFLARE] Keeping valid A record: ${record.name} -> ${newIp}`);
            if (record.name === zoneName) hasNewIpRoot = true;
            continue;
          }
          console.log(`🧨 [CLOUDFLARE] DELETING OLD A RECORD: ${record.name} (${record.content})...`);
        } 
        // Handle AAAA records (IPv6) - Delete them all to force IPv4
        else if (record.type === 'AAAA') {
          console.log(`🧨 [CLOUDFLARE] DELETING AAAA RECORD: ${record.name} (${record.content})...`);
        } else {
          continue; // Skip CNAME, MX, etc.
        }

        await axios.delete(`${CF_API_URL}/zones/${zoneId}/dns_records/${record.id}`, { headers: this.headers });
      }

      // 2. Ensure the root domain (@) points to the new IP
      if (!hasNewIpRoot) {
        console.log(`🆕 [CLOUDFLARE] Creating root A record for ${zoneName} -> ${newIp}`);
        await axios.post(`${CF_API_URL}/zones/${zoneId}/dns_records`, {
          type: 'A',
          name: zoneName,
          content: newIp,
          ttl: 1,
          proxied: true
        }, { headers: this.headers });
      }

      // 3. Ensure wildcard (*) points to the new IP
      const hasWildcard = records.some((r: any) => r.name === `*.${zoneName}` && r.content === newIp && r.type === 'A');
      if (!hasWildcard) {
        console.log(`🆕 [CLOUDFLARE] Creating wildcard A record for ${zoneName} -> ${newIp}`);
        await axios.post(`${CF_API_URL}/zones/${zoneId}/dns_records`, {
          type: 'A',
          name: '*',
          content: newIp,
          ttl: 1,
          proxied: true
        }, { headers: this.headers });
      }

    } catch (error: any) {
      console.error(`❌ [CLOUDFLARE] Failed to sync ${zoneName}:`, error.response?.data || error.message);
    }
  }

  /**
   * 🔥 MASS SYNC: Point all domains in the account to the new IP.
   */
  async massSyncToNewIP(newIp: string) {
    console.log(`🚀 [CLOUDFLARE] Starting MASS SYNC to IP: ${newIp}...`);
    
    // 🛡️ EXCLUSION LIST: Domains that should NEVER be auto-synced
    const exclusionList = ['zeynep', 'test-domain', 'personal-blog'];
    
    try {
      const response = await axios.get(`${CF_API_URL}/zones?per_page=1000`, { headers: this.headers });
      const zones = response.data.result;

      if (zones.length === 0) {
        console.warn("⚠️ [CLOUDFLARE] No zones found to sync.");
        return;
      }

      for (const zone of zones) {
        const isExcluded = exclusionList.some(ex => zone.name.includes(ex));
        
        if (isExcluded) {
          console.log(`🛡️ [CLOUDFLARE] Skipping excluded zone: ${zone.name}`);
          continue;
        }

        await this.syncZone(zone.id, zone.name, newIp);
        // Throttle to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
      }

      console.log("🏁 [CLOUDFLARE] Mass Sync Complete!");
    } catch (error: any) {
      console.error("❌ [CLOUDFLARE] Mass Sync failed:", error.message);
    }
  }
}

export const cloudflareManager = new CloudflareManager();
