import axios from 'axios';

// ==============================================================================
// DRKCNAY HYDRA: XML-RPC INDEX PINGER CLIENT (v1.0)
// Sends instant XML-RPC ping signals to search crawlers notifying content updates.
// ==============================================================================

const PING_SERVICES = [
  { name: 'Ping-o-Matic', url: 'http://rpc.pingomatic.com/' },
  { name: 'Google Blog Search', url: 'http://blogsearch.google.com/ping/RPC2' },
  { name: 'Feedburner', url: 'http://ping.feedburner.com' },
  { name: 'Superfeedr', url: 'http://push.superfeedr.com/' },
  { name: 'Weblogs', url: 'http://rpc.weblogs.com/RPC2' }
];

export class PingClient {
  /**
   * Builds the standard XML-RPC payload for pinging
   */
  private static buildXmlPayload(siteName: string, siteUrl: string): string {
    return `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param>
      <value>${siteName}</value>
    </param>
    <param>
      <value>${siteUrl}</value>
    </param>
  </params>
</methodCall>`;
  }

  /**
   * Pings all configured services for a specific website update
   */
  public static async pingAll(siteName: string, siteUrl: string): Promise<void> {
    console.log(`🚀 [XML-RPC PINGER] Initiating ping broadcast for: ${siteName} (${siteUrl})`);
    const xmlData = this.buildXmlPayload(siteName, siteUrl);

    const promises = PING_SERVICES.map(async (service) => {
      try {
        const response = await axios.post(service.url, xmlData, {
          headers: {
            'Content-Type': 'text/xml',
            'User-Agent': 'Mozilla/5.0 (compatible; HydraSeoPinger/2.0)'
          },
          timeout: 8000
        });

        if (response.status === 200) {
          console.log(`✅ [PINGER] Successfully pinged: ${service.name}`);
          return { service: service.name, success: true };
        }
        return { service: service.name, success: false };
      } catch (error: any) {
        // Silent failure for logs to keep command execution clean
        return { service: service.name, success: false, error: error.message };
      }
    });

    await Promise.all(promises);
    console.log(`🏁 [XML-RPC PINGER] Ping broadcast completed.`);
  }
}
