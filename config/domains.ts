/**
 * ⚡ DRKCNAY ELITE HYDRA DOMAIN MATRIX 2026
 * Supports IP Isolation & Centralized API HQ.
 */

export type DomainRole = 'MONEY_SITE' | 'CLOAKER' | 'SATELLITE' | 'FALLBACK';

export interface DomainConfig {
  host: string;
  role: DomainRole;
  targetCity?: string;
  targetDistrict?: string;
  theme: 'gold' | 'rose' | 'emerald' | 'dark' | 'luxury';
  serverGroup: 'CLOAKER_SERVER' | 'MAIN_SERVER';
}

export const DOMAIN_MATRIX: DomainConfig[] = [
  // --- ALL DOMAINS NOW ON MAIN SERVER (Server B - 213.232.235.181) ---
  { host: 'vipescorthizmeti.com', role: 'MONEY_SITE', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'escortvip.net', role: 'MONEY_SITE', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'vipescorthizmeti.shop', role: 'MONEY_SITE', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'bagcilarescort.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'bagcilar', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'esenyurtescort.blog', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'esenyurt', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'esenyurtescorthizmeti.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'esenyurt', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'beylikduzuescortlistesi.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'beylikduzu', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'besiktasescorthizmeti.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'besiktasescort.fun', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'besiktasescort.blog', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'taksimescorthizmeti.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'beyoglu', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sefakoyescorthizmeti.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'kucukcekmece', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'kucukcekmecescort.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'kucukcekmece', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'sisliescort.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'sisli', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'avrupayakasiescort.shop', role: 'SATELLITE', targetCity: 'istanbul', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbulescorthizmeti.shop', role: 'SATELLITE', targetCity: 'istanbul', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbulescort.blog', role: 'SATELLITE', targetCity: 'istanbul', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'kadikoyescort.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'kadikoy', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'pendikescorthizmeti.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'pendik', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'bucaescorthizmeti.shop', role: 'SATELLITE', targetCity: 'izmir', targetDistrict: 'buca', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'izmitescorthizmeti.shop', role: 'SATELLITE', targetCity: 'kocaeli', targetDistrict: 'izmit', theme: 'emerald', serverGroup: 'MAIN_SERVER' },

  // --- NEW SATELLITE DOMAINS ---
  { host: 'sariyerdrkcnay.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'sariyer', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'leventdrkcnay.shop', role: 'SATELLITE', targetCity: 'istanbul', targetDistrict: 'besiktas', theme: 'gold', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbuldrkcnay.shop', role: 'SATELLITE', targetCity: 'istanbul', theme: 'rose', serverGroup: 'MAIN_SERVER' },
  { host: 'istanbulescortkaporasiz.shop', role: 'SATELLITE', targetCity: 'istanbul', theme: 'emerald', serverGroup: 'MAIN_SERVER' },
  { host: 'shopistanbulescortkaporasiz.site', role: 'SATELLITE', targetCity: 'istanbul', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'dorukcanay.digital', role: 'SATELLITE', targetCity: 'istanbul', theme: 'luxury', serverGroup: 'MAIN_SERVER' },
  { host: 'escortcoin.space', role: 'SATELLITE', theme: 'gold', serverGroup: 'MAIN_SERVER' },

  // --- CLOAKER (E-COMMERCE / PHARMACY / TRAP) SUBDOMAINS ---
  { host: 'eczane.vipescorthizmeti.com', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'shop.vipescorthizmeti.com', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'performans.vipescorthizmeti.com', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },

  // --- CLOAKER (TUBE / İFŞA / HONEY-POT) DOMAINS ---
  { host: 'magazinifsa.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sokhaberifsa.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'dilanpolatifsa.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sansursuzturkifsa.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'exxvideos.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'telegramifsaizle.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'turkifsalar.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'turkifsapremium.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'onlyfansizle.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },

  // --- CLOAKER (HACK / CLICKBAIT / TOOL) DOMAINS ---
  { host: 'santajci-tespit.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'plakasorgula.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'casus-yazilim-sil.xyz', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'sanalsms.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'kazandiranborsatuyolari.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'tiktokhilesi.sbs', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'bedavahesap.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'instacoz.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'canlimaclinki.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'kesintisizizle.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'fullapkoyun.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'fragmanizle.shop', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'konumbulucu.xyz', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'dizicehennemi.site', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' },
  { host: 'yardimbasvurusu.online', role: 'CLOAKER', theme: 'dark', serverGroup: 'MAIN_SERVER' }
];

export const API_HQ_DOMAIN = 'https://vipescorthizmeti.com';

export function getDomainConfig(host: string) {
  const currentGroup = process.env.SERVER_GROUP || 'MAIN_SERVER';
  const config = DOMAIN_MATRIX.find(d => host.includes(d.host));
  
  if (currentGroup === 'CLOAKER_SERVER') {
    // Legacy fallback
    return config || DOMAIN_MATRIX[0];
  }
  
  return config || DOMAIN_MATRIX[0];
}

