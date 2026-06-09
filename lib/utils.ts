type ClassValue = string | number | boolean | null | undefined | ClassValue[];

/**
 * Lightweight cn() — clsx + tailwind-merge bağımlılığı olmadan
 * Falsy değerleri filtreler, string sınıfları birleştirir.
 */
function flattenClasses(inputs: ClassValue[]): string[] {
  return inputs.flatMap((input) => {
    if (!input && input !== 0) return [];
    if (Array.isArray(input)) return flattenClasses(input);
    return [String(input)];
  });
}

export function cn(...inputs: ClassValue[]): string {
  return flattenClasses(inputs).join(" ");
}

// 🛡️ GLOBAL FAILSAFE: Prevent ReferenceError: returnNaN is not defined
if (typeof globalThis !== 'undefined' && !('returnNaN' in globalThis)) {
  (globalThis as any).returnNaN = () => NaN;
}

/**
 * GOD-MODE: Sanitize Display Names
 * Cleans long SEO titles or encoded slugs into clean human-readable names.
 */
export function sanitizeDisplayName(name: string): string {
  if (!name) return "";
  
  try {
    // 1. Fix URL Encoding and Normalize Unicode (Fixes %CC%87 etc.)
    let clean = decodeURIComponent(name).normalize('NFC');
    
    // 2. Remove purely technical SEO noise, but KEEP branding/category
    clean = clean.split(" | ")[0]; 
    clean = clean.split(" [2026]")[0];
    clean = clean.replace(/_/g, ' ');
    clean = clean.replace(/-/g, ' ');
    
    // 3. Force clean Turkish character mapping for residual artifacts
    clean = clean.replace(/i̇/g, 'i').replace(/İ/g, 'İ');
    
    return clean.trim();
  } catch (e) {
    return name.normalize('NFC').replace(/%C3%BC/g, 'ü').replace(/%C3%B6/g, 'ö').replace(/-/g, ' ').trim();
  }
}
/**
 * 🇹🇷 SOVEREIGN SLUGIFY: Ultimate Turkish Character Mapping
 * Fixes: ş, ç, ı, ğ, ö, ü -> s, c, i, g, o, u
 */
export function slugify(text: string): string {
  if (!text) return "";
  
  const trMap: { [key: string]: string } = {
    'ş': 's', 'Ş': 's', 'ç': 'c', 'Ç': 'c', 'ı': 'i', 'İ': 'i', 
    'ğ': 'g', 'Ğ': 'g', 'ö': 'o', 'Ö': 'o', 'ü': 'u', 'Ü': 'u'
  };

  let slug = text.toString().toLowerCase().trim();
  
  // Replace Turkish characters
  Object.keys(trMap).forEach(key => {
    slug = slug.replace(new RegExp(key, 'g'), trMap[key]);
  });

  return slug
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

/**
 * 🛡️ SEO DEDUPE: Prevent "Escort Escort" or "Escort Eskort" keyword stuffing.
 * Enforces that the word "escort" or "eskort" (and their plural forms) appears at most once in any generated text/title.
 */
export function dedupeEscort(text: string): string {
  if (!text) return "";
  
  const words = text.split(/\s+/);
  const result: string[] = [];
  let foundEscort = false;
  
  for (const word of words) {
    // Strip punctuation to check base word (e.g. "escort'lar" -> "escortlar", "escort," -> "escort")
    const cleanWord = word.replace(/[^a-zA-Z\u00C0-\u017F]/g, '').toLowerCase();
    const isEscortWord = ['escort', 'escorts', 'eskort', 'eskortlar'].includes(cleanWord);
    
    if (isEscortWord) {
      if (!foundEscort) {
        result.push(word);
        foundEscort = true;
      }
    } else {
      result.push(word);
    }
  }
  
  return result.join(' ').replace(/\s\s+/g, ' ').trim();
}

/**
 * Converts a string to Turkish Title Case (capitalizes first letter of each word).
 * Correctly handles Turkish characters: ı -> I/I -> ı, i -> İ/İ -> i, etc.
 * Keeps special acronyms like VIP, DMCA, GSC, EEAT, SGE in full uppercase.
 */
export function toTitleCaseTR(str: string): string {
  if (!str) return "";
  
  // Clean hyphens out of URL slugs/categories to display clean spaces
  const cleanStr = str.replace(/-/g, ' ');
  
  return cleanStr
    .split(/\s+/)
    .map(word => {
      if (!word) return "";
      
      const lowerWord = word.toLowerCase();
      if (lowerWord === 'vip' || lowerWord === 'vıp') return 'VIP';
      if (lowerWord === 'dmca') return 'DMCA';
      if (lowerWord === 'gsc') return 'GSC';
      if (lowerWord === 'sge') return 'SGE';
      if (lowerWord === 'eeat') return 'EEAT';
      if (lowerWord === 'drkcnay') return 'DRKCNAY';
      if (lowerWord === 'drkcny') return 'DRKCNY';
      if (lowerWord === 'elite') return 'Elite';
      if (lowerWord === 'luxury') return 'Luxury';
      if (lowerWord === 'companion') return 'Companion';
      if (lowerWord === 'companions') return 'Companions';
      if (lowerWord === 'escort') return 'Escort';
      if (lowerWord === 'escorts') return 'Escorts';
      if (lowerWord === 'network') return 'Network';
      if (lowerWord === 'cloud') return 'Cloud';
      if (lowerWord === 've' || lowerWord === 'veya' || lowerWord === 'ile' || lowerWord === 'de' || lowerWord === 'da') return lowerWord;
      
      const first = word.charAt(0);
      const rest = word.slice(1);
      
      let upperFirst = first;
      if (first === 'i') upperFirst = 'İ';
      else if (first === 'ı') upperFirst = 'I';
      else upperFirst = first.toUpperCase();
      
      let lowerRest = '';
      for (let i = 0; i < rest.length; i++) {
        const char = rest.charAt(i);
        if (char === 'I') lowerRest += 'ı';
        else if (char === 'İ') lowerRest += 'i';
        else lowerRest += char.toLowerCase();
      }
      
      return upperFirst + lowerRest;
    })
    .join(' ');
}
