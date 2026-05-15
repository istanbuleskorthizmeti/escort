/**
 * DRKCNAY SPINTAX ENGINE v4.0 - "GOD MODE"
 * Handles deep recursion, variable injection, and TDK-compliant formatting.
 */

export class DRKCNAYSpintax {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? this.hashString(seed) : seed;
  }

  private hashString(str: string): number {
    let hash = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
    }
    return hash >>> 0;
  }

  private rand(): number {
    this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
    return this.seed / 2147483648;
  }

  /**
   * Resolves recursive spintax: { {A|B} | C }
   */
  public resolve(text: string, variables: Record<string, string> = {}): string {
    // 1. Inject Variables
    let processed = this.injectVariables(text, variables);

    // 2. Clear pattern-based robotic markers
    processed = processed.replace(/\[\d+\. (Aşama|Kısım)\]/g, ''); 

    // 3. Resolve Spintax Recursively
    const spintaxRegex = /\{([^{}]+)\}/g;
    while (processed.includes('{') && processed.includes('}')) {
      const match = processed.match(spintaxRegex);
      if (!match) break;
      
      for (const m of match) {
        const choices = m.slice(1, -1).split('|');
        const choice = choices[Math.floor(this.rand() * choices.length)];
        processed = processed.replace(m, choice);
      }
    }

    // 4. TDK Compliance & Cleanup
    return this.finalize(processed);
  }

  private injectVariables(text: string, variables: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      result = result.replace(regex, value);
    }
    return result;
  }

  /**
   * Finalizes text with TDK rules and clean punctuation.
   */
  private finalize(text: string): string {
    return text
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Fix spaces before punctuation
      .replace(/\s+([.,!?;])/g, '$1')
      // Fix double punctuation
      .replace(/([.,!?;])\1+/g, '$1')
      // Handle Turkish Apostrophe standard (TDK)
      .replace(/'/g, '’')
      // Trim
      .trim()
      // Capitalize first letter (TDK)
      .replace(/^\w/, (c) => c.toLocaleUpperCase('tr-TR'));
  }
}

/**
 * Global helper for quick resolution
 */
export function resolveDRKCNAYSpintax(text: string, seed: string, variables: Record<string, string> = {}): string {
  const engine = new DRKCNAYSpintax(seed);
  return engine.resolve(text, variables);
}
