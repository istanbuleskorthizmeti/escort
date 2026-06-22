import axios from 'axios';

export interface ValidationReport {
  isSafe: boolean;
  keywordDensity: Record<string, number>;
  issues: string[];
}

export class SeoValidator {
  private static readonly OPTIMAL_DENSITY_MIN = 0.5; // %0.5
  private static readonly OPTIMAL_DENSITY_MAX = 3.0; // %3.0

  /**
   * Calculates density of target keywords in a body of text.
   * Time Complexity: O(N) where N is the number of words.
   */
  public static analyzeKeywordDensity(text: string, keywords: string[]): Record<string, number> {
    if (!text) return {};
    
    const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const totalWords = words.length;

    if (totalWords === 0) return {};

    const densityMap: Record<string, number> = {};

    for (const kw of keywords) {
      const kwLower = kw.toLowerCase();
      const count = words.filter(w => w === kwLower).length;
      densityMap[kw] = Number(((count / totalWords) * 100).toFixed(2));
    }

    return densityMap;
  }

  /**
   * Validates if a string is a valid JSON-LD structure.
   */
  public static validateJsonLd(jsonLdString: string): { isValid: boolean; error?: string } {
    try {
      const cleanJson = jsonLdString
        .replace(/<script[^>]*>/gi, '')
        .replace(/<\/script>/gi, '')
        .trim();
      
      const parsed = JSON.parse(cleanJson);
      
      if (!parsed['@context']) {
        return { isValid: false, error: 'Missing "@context" property.' };
      }
      return { isValid: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown JSON parsing error';
      return { isValid: false, error: message };
    }
  }

  /**
   * Verifies outbound links are reachable to prevent broken link penalties.
   */
  public static async verifyLinks(links: string[]): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    // Process requests in parallel with Promise.all
    await Promise.all(
      links.map(async (link) => {
        try {
          const response = await axios.head(link, { timeout: 5000 });
          results[link] = response.status >= 200 && response.status < 400;
        } catch {
          try {
            // Fallback to GET if HEAD request is blocked
            const getResponse = await axios.get(link, { timeout: 5000 });
            results[link] = getResponse.status >= 200 && getResponse.status < 400;
          } catch {
            results[link] = false;
          }
        }
      })
    );

    return results;
  }

  /**
   * Runs a complete SEO audit on the generated dynamic page parts.
   */
  public static async auditPage(
    content: string,
    schema: string,
    targetKeywords: string[],
    outboundLinks: string[]
  ): Promise<ValidationReport> {
    const issues: string[] = [];
    
    // 1. Density Audit
    const densities = this.analyzeKeywordDensity(content, targetKeywords);
    for (const [kw, density] of Object.entries(densities)) {
      if (density > this.OPTIMAL_DENSITY_MAX) {
        issues.push(`Keyword stuffed: "${kw}" density is ${density}% (Recommended limit is ${this.OPTIMAL_DENSITY_MAX}%).`);
      } else if (density < this.OPTIMAL_DENSITY_MIN) {
        issues.push(`Under-optimized: "${kw}" density is only ${density}% (Target at least ${this.OPTIMAL_DENSITY_MIN}%).`);
      }
    }

    // 2. Schema Audit
    const schemaValidation = this.validateJsonLd(schema);
    if (!schemaValidation.isValid) {
      issues.push(`Invalid JSON-LD Schema: ${schemaValidation.error}`);
    }

    // 3. Link Audit
    if (outboundLinks.length > 0) {
      const linkStatuses = await this.verifyLinks(outboundLinks);
      for (const [link, isHealthy] of Object.entries(linkStatuses)) {
        if (!isHealthy) {
          issues.push(`Broken Link Detected: URL "${link}" is not returning a successful status code.`);
        }
      }
    }

    return {
      isSafe: issues.length === 0,
      keywordDensity: densities,
      issues
    };
  }
}
