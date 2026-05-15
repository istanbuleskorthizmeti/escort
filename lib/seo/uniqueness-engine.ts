/**
 * 🧛‍♂️ HYDRA UNIQUENESS ENGINE
 * Her alan adı için statik görünümlü alanları dinamik ve özgün hale getirir.
 * Google Botlarının "Pattern Recognition" (Kalıp Tanıma) filtrelerini patlatır.
 */

function getSeedFromHost(host: string): number {
  let hash = 0;
  for (let i = 0; i < host.length; i++) {
    hash = Math.imul(31, hash) + host.charCodeAt(i) | 0;
  }
  return Math.abs(hash);
}

export const AGENCY_NAMES = [
  "DRKCNAY Elite Haber Ajansı", "Istanbul VIP Rehberlik", "Drkcnay Elite Partner Portalı",
  "VIP Yaşam Bülteni", "Elit İlişki Koçluğu", "İstanbul Sosyete Rehberi", "Global Elite Network",
  "Prestige Partner Ajansı", "Lüks Yaşam Portalı", "Elite News Network"
];

export const BOT_TRAP_PHRASES = [
  "Bunu mu demek istediniz:", "Aramalarınızda şunları mı buldunuz:", "Şu kelimelerle mi ilgileniyorsunuz:",
  "İlginizi çekebilecek başlıklar:", "Bölgenizdeki diğer sonuçlar:", "Popüler aramalar:"
];

export const FALLBACK_MESSAGES = [
  "Sistemimiz şu an güvenlik güncellemesi nedeniyle kısıtlı hizmet vermektedir.",
  "Yoğun talep üzerine içeriklerimiz yeniden optimize ediliyor. Lütfen bekleyin.",
  "Bölgedeki partner listesi güncelleniyor. VIP standartlarımız gereği gizlilik ön plandadır.",
  "Yeni elit profiller sisteme dahil ediliyor. Rezervasyon için WhatsApp kullanın."
];

export function getUniqueness(host: string) {
  const seed = getSeedFromHost(host);
  
  return {
    agencyName: AGENCY_NAMES[seed % AGENCY_NAMES.length],
    botTrapPrefix: BOT_TRAP_PHRASES[(seed >> 2) % BOT_TRAP_PHRASES.length],
    fallbackMessage: FALLBACK_MESSAGES[(seed >> 4) % FALLBACK_MESSAGES.length],
    // Dinamik SEO Kalıpları
    seoSuffix: seed % 2 === 0 ? "2026 Güncel Liste" : "VIP Standartlar",
  };
}
