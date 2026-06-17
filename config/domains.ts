/**
 * ⚡ DRKCNAY ELITE HYDRA DOMAIN MATRIX 2026
 * Supports IP Isolation & Centralized API HQ.
 */

export type DomainRole = 'MONEY_SITE' | 'CLOAKER' | 'SATELLITE' | 'FALLBACK';
export type DomainCategory = 'MONEY_SITE' | 'SATELLITE_LOCAL' | 'CLOAKER_EC' | 'CLOAKER_IFSA' | 'CLOAKER_TOOL';

export interface DomainConfig {
  host: string;
  role: DomainRole;
  category: DomainCategory;
  tags: string[];
  targetCity?: string;
  targetDistrict?: string;
  theme: 'gold' | 'rose' | 'emerald' | 'dark' | 'luxury';
  serverGroup: 'CLOAKER_SERVER' | 'MAIN_SERVER';
}

export const DOMAIN_MATRIX: DomainConfig[] = [
  { host: 'istanbulescort.blog', role: 'MONEY_SITE', category: 'MONEY_SITE', tags: ['vip', 'premium', 'luxury', 'main'], theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'escortvip.net', role: 'MONEY_SITE', category: 'MONEY_SITE', tags: ['vip', 'directory', 'main'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'vipescorthizmeti.shop', role: 'MONEY_SITE', category: 'MONEY_SITE', tags: ['vip', 'luxury', 'shop'], theme: 'gold', serverGroup: 'MAIN_SERVER' },

  // --- SATELLITE LOCAL DOMAINS (ISTANBUL & OTHERS) ---
  { host: 'bagcilarescort.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'bagcilar', 'young'], targetCity: 'istanbul', targetDistrict: 'bagcilar', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'esenyurtescort.blog', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'esenyurt', 'blog'], targetCity: 'istanbul', targetDistrict: 'esenyurt', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'esenyurtescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'esenyurt', 'service'], targetCity: 'istanbul', targetDistrict: 'esenyurt', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'beylikduzuescortlistesi.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'beylikduzu', 'list'], targetCity: 'istanbul', targetDistrict: 'beylikduzu', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'besiktasescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'besiktas', 'premium'], targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'besiktasescort.fun', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'besiktas', 'fun'], targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'besiktasescort.blog', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'besiktas', 'blog'], targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'taksimescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'taksim', 'beyoglu'], targetCity: 'istanbul', targetDistrict: 'beyoglu', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sefakoyescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'sefakoy', 'kucukcekmece'], targetCity: 'istanbul', targetDistrict: 'sefakoy', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'kucukcekmecescort.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'kucukcekmece', 'shop'], targetCity: 'istanbul', targetDistrict: 'kucukcekmece', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'sisliescort.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'sisli', 'luxury'], targetCity: 'istanbul', targetDistrict: 'sisli', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'avrupayakasiescort.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'avrupa-yakasi', 'general'], targetCity: 'istanbul', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbulescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'istanbul', 'general'], targetCity: 'istanbul', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'kadikoyescort.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'kadikoy', 'anadolu-yakasi'], targetCity: 'istanbul', targetDistrict: 'kadikoy', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'pendikescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'pendik', 'anadolu-yakasi'], targetCity: 'istanbul', targetDistrict: 'pendik', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'bucaescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'buca', 'izmir'], targetCity: 'izmir', targetDistrict: 'buca', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'izmitescorthizmeti.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'izmit', 'kocaeli'], targetCity: 'kocaeli', targetDistrict: 'izmit', theme: 'emerald', serverGroup: 'MAIN_SERVER' },

  // --- NEW SATELLITE DOMAINS ---
  { host: 'sariyerdrkcnay.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'sariyer', 'drkcnay'], targetCity: 'istanbul', targetDistrict: 'sariyer', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'leventdrkcnay.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'levent', 'drkcnay'], targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbuldrkcnay.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'istanbul', 'drkcnay'], targetCity: 'istanbul', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbulescortkaporasiz.shop', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'istanbul', 'kaporasiz'], targetCity: 'istanbul', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'shopistanbulescortkaporasiz.site', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['local', 'istanbul', 'kaporasiz', 'shop'], targetCity: 'istanbul', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'dorukcanay.digital', role: 'MONEY_SITE', category: 'MONEY_SITE', tags: ['vip', 'premium', 'luxury', 'main', 'flagship'], theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'escortcoin.space', role: 'SATELLITE', category: 'SATELLITE_LOCAL', tags: ['crypto', 'escort', 'token'], theme: 'gold', serverGroup: 'MAIN_SERVER' },

  // --- CLOAKER (E-COMMERCE / PHARMACY / TRAP) SUBDOMAINS ---
  { host: 'eczane.istanbulescort.blog', role: 'CLOAKER', category: 'CLOAKER_EC', tags: ['pharmacy', 'performans', 'ereksiyon'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'shop.istanbulescort.blog', role: 'CLOAKER', category: 'CLOAKER_EC', tags: ['e-commerce', 'performans', 'shop'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'performans.istanbulescort.blog', role: 'CLOAKER', category: 'CLOAKER_EC', tags: ['performans', 'geciktirici', 'eczane'], theme: 'dark', serverGroup: 'MAIN_SERVER' },

  // --- CLOAKER (TUBE / İFŞA / HONEY-POT) DOMAINS ---
  { host: 'magazinifsa.site', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'magazin', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sokhaberifsa.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'sok-haber', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'dilanpolatifsa.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'dilan-polat', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sansursuzturkifsa.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'sansursuz', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'exxvideos.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'videos', 'premium'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'telegramifsaizle.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'telegram', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'turkifsalar.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'turk-ifsa', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'turkifsapremium.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'premium', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'onlyfansizle.shop', role: 'CLOAKER', category: 'CLOAKER_IFSA', tags: ['ifsa', 'onlyfans', 'video'], theme: 'dark', serverGroup: 'MAIN_SERVER' },

  // --- CLOAKER (HACK / CLICKBAIT / TOOL) DOMAINS ---
  { host: 'santajci-tespit.site', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'santajci', 'hack'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'plakasorgula.shop', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'plaka-sorgula', 'clickbait'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'casus-yazilim-sil.xyz', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'casus-yazilim', 'sil'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sanalsms.site', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'sanal-sms', 'clickbait'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'kazandiranborsatuyolari.site', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'borsa', 'tuyo'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'tiktokhilesi.sbs', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'tiktok', 'hile'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'bedavahesap.site', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'bedava-hesap', 'games'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'instacoz.site', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'instagram', 'cozum'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'canlimaclinki.shop', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'mac', 'canli-yayin'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'kesintisizizle.shop', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'tv', 'canli-yayin'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'fullapkoyun.shop', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'apk', 'indir'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'fragmanizle.shop', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'fragman', 'film'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'konumbulucu.xyz', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['tool', 'konum-bulucu', 'hack'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'dizicehennemi.site', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'dizi', 'izle'], theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'yardimbasvurusu.online', role: 'CLOAKER', category: 'CLOAKER_TOOL', tags: ['clickbait', 'yardim', 'basvuru'], theme: 'dark', serverGroup: 'MAIN_SERVER' }
];

export const API_HQ_DOMAIN = 'https://istanbulescort.blog/amp';

export function getDomainConfig(host: string) {
  const currentGroup = process.env.SERVER_GROUP || 'MAIN_SERVER';
  const config = DOMAIN_MATRIX.find(d => host.includes(d.host));
  
  if (currentGroup === 'CLOAKER_SERVER') {
    // Legacy fallback
    return config || DOMAIN_MATRIX.find(d => d.host === 'istanbulescort.blog') || DOMAIN_MATRIX[0];
  }
  
  return config || DOMAIN_MATRIX.find(d => d.host === 'istanbulescort.blog') || DOMAIN_MATRIX[0];
}

