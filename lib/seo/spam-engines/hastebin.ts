import axios from 'axios';

/**
 * ☠️ HASTEBIN SPAM ENGINE
 * Creates anonymous pastes with raw text and links.
 * Domain Rating: 60+ (Good for Tier 3 diversity)
 */
export class HastebinEngine {
  private static endpoints = [
    'https://paste.rs/',
    'https://dpaste.com/api/v2/' // Fallback pastebin alternatives
  ];

  /**
   * Generates an anonymous paste.
   * @param content Raw text content (can include URLs)
   * @returns The URL of the created paste
   */
  public static async createPaste(content: string): Promise<string | null> {
    try {
      // Primary attack vector: Paste.rs
      // Adding aggressive SEO footer
      const aggressiveContent = `${content}\n\n---\n#vipescort #istanbulescort #elitpartner #guvenilirescort #kaporasizescort\nIstanbul'un en seckin VIP Escort katalogu. Dogrulanmis profiller, gercek resimler ve aninda iletisim.`;
      
      const response = await axios.post(this.endpoints[0], aggressiveContent, {
        headers: {
          'Content-Type': 'text/plain',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      });

      if (response.data) {
        return response.data.trim(); // paste.rs returns the raw URL
      }
      return null;
    } catch (e: any) {
       console.error("[HASTEBIN] Primary failed, attempting fallback...", e.message);
       // Fallback to paste.rs
       try {
           const fallbackResponse = await axios.post(this.endpoints[1], content, {
                headers: { 'Content-Type': 'text/plain' },
                timeout: 5000
           });
           if(fallbackResponse.data) {
               return fallbackResponse.data.trim();
           }
       } catch (fallbackError) {
           console.error("[HASTEBIN] Fallback failed as well.");
           return null;
       }
       return null;
    }
  }
}
