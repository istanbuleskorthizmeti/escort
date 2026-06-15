/**
 * 🌀 TYPE-SAFE DETERMINISTIC SPINTAX PARSER ENGINE
 * Designed for O(n) complexity and stateless execution.
 */

/**
 * Generates a pseudo-random number based on a seed.
 * Utilizes a linear congruential generator (LCG) algorithm.
 */
export function getSeededRandom(seed: number): () => number {
  let currentSeed = seed >>> 0;
  return (): number => {
    currentSeed = (Math.imul(currentSeed, 1103515245) + 12345) & 0x7fffffff;
    return currentSeed;
  };
}

/**
 * Parses spintax patterns of the format "{option1|option2|option3}" deterministically.
 */
export function parseSpintax(text: string, randomFn: () => number): string {
  // Matches non-nested spintax blocks {option1|option2|...}
  const regex = /{([^{}]+)}/;
  let result = text;
  
  while (regex.test(result)) {
    result = result.replace(regex, (_, choicesStr: string) => {
      const choices = choicesStr.split('|');
      const idx = randomFn() % choices.length;
      return choices[idx] ?? '';
    });
  }
  
  return result;
}

/**
 * Generates a stable FNV-1a 32-bit hash for a given string.
 */
export function hashString(str: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}
