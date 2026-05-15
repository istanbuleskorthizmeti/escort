/**
 * 🕵️ DRKCNAY FOOTPRINT SCRUBBER (GREY HACKER MODE)
 * Randomizes HTML footprints to bypass Google's Brainspam/Pattern algorithms.
 */

const SEED_PREFIXES = ['auth', 'prime', 'elite', 'vibrant', 'alpha', 'node'];

export function generateScrambledClassName(originalName: string, domainSeed: string): string {
  // Use the domain as a seed to ensure same domain has consistent but unique classes
  let hash = 0;
  const combined = originalName + domainSeed;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash << 5) - hash + combined.charCodeAt(i);
    hash |= 0; 
  }
  
  const prefix = SEED_PREFIXES[Math.abs(hash) % SEED_PREFIXES.length];
  const suffix = Math.abs(hash).toString(36).substring(0, 4);
  
  return `${prefix}_${suffix}`;
}

/**
 * ⚡ ENTITY INJECTOR
 * Injects "Human Noise" into AI content to bypass originality filters.
 */
export function injectHumanNoise(content: string, district: string): string {
  const currentHour = new Date().getHours();
  const noise = [
    `Şu an ${district} bölgesinde trafik oldukça yoğun, görüşme saatinizi ona göre ayarlayın.`,
    `Hava durumu ${district} çevresinde oldukça güzel, dışarıda bir kahve içmek için harika bir gün.`,
    `${district} merkezdeki bilindik AVM'lere oldukça yakın bir konumdayım.`,
    `Bugün ${new Date().toLocaleDateString('tr-TR')} ve tüm ilanlarımız güncellendi.`
  ];
  
  const randomNoise = noise[Math.floor(Math.random() * noise.length)];
  return `${content} <br/><br/> <i>📌 Not: ${randomNoise}</i>`;
}
