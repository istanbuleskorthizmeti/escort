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
 * 🛡️ SEO DEDUPE: Prevent "Escort Escort" keyword stuffing.
 * Removes duplicate instances of "Escort" (case-insensitive) while keeping the first one or two based on context.
 */
export function dedupeEscort(text: string): string {
  if (!text) return "";
  
  // Normalize "Eskort" to "Escort" for consistency during deduplication
  let clean = text.replace(/eskort/gi, 'Escort');
  
  // Split into words and filter
  const words = clean.split(' ');
  const result: string[] = [];
  let escortCount = 0;
  
  for (const word of words) {
    const isEscort = word.toLowerCase().includes('escort');
    if (isEscort) {
      escortCount++;
      // Allow max 2 "Escort" words in a long title, but only if they aren't consecutive
      if (escortCount <= 2) {
        if (result.length > 0 && result[result.length - 1].toLowerCase().includes('escort')) {
           // Skip consecutive "Escort"
           continue;
        }
        result.push(word);
      }
    } else {
      result.push(word);
    }
  }
  
  return result.join(' ').replace(/\s\s+/g, ' ').trim();
}
