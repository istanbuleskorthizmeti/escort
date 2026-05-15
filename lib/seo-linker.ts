/**
 * AKILLI LİNKLEYİCİ
 * Metin içindeki mahalle, ilçe ve anahtar kelimeleri otomatik olarak 
 * ilgili sayfalara güvenli bir şekilde linkler.
 */

interface LinkRule {
  term: string;
  slug: string;
  isCategory?: boolean;
}

const linkRules: LinkRule[] = [
  // İstanbul
  { term: "Bakırköy", slug: "/istanbul/bakirkoy" },
  { term: "Beşiktaş", slug: "/istanbul/besiktas" },
  { term: "Şişli", slug: "/istanbul/sisli" },
  { term: "Kadıköy", slug: "/istanbul/kadikoy" },
  { term: "Ataşehir", slug: "/istanbul/atasehir" },
  { term: "Yeşilköy", slug: "/istanbul/bakirkoy/yesilkoy" },
  { term: "Nişantaşı", slug: "/istanbul/sisli/nisantasi" },
  { term: "Bebek", slug: "/istanbul/besiktas/bebek" },
  { term: "Moda", slug: "/istanbul/kadikoy/moda" },
  
  // Diğer Büyükşehirler
  { term: "Çankaya", slug: "/ankara/cankaya" },
  { term: "Kızılay", slug: "/ankara/cankaya/kizilay" },
  { term: "Alsancak", slug: "/izmir/alsancak" },
  { term: "Konak", slug: "/izmir/konak" },
  { term: "Nilüfer", slug: "/bursa/nilufer" },
  { term: "Muratpaşa", slug: "/antalya/muratpasa" },
  
  // Kategoriler
  { term: "VIP Escort", slug: "/vip-escort", isCategory: true },
  { term: "Mutlu Son", slug: "/mutlu-son", isCategory: true },
  { term: "Elite Partner", slug: "/elit-partner", isCategory: true },
  { term: "Duo Escort", slug: "/duo-escort", isCategory: true },
  
  // Rehber / Ansiklopedi
  { term: "Tam Gizlilik", slug: "/ansiklopedi#gizlilik" },
  { term: "Kaporasız", slug: "/ansiklopedi#guvenli-protokol" },
  { term: "Elit Seviye", slug: "/ansiklopedi#elit-seviye" }
];

/**
 * Verilen HTML içeriği içindeki terimleri bulup linklerle değiştirir.
 * Halihazırda linklenmiş metinleri veya HTML etiketlerini atlar.
 */
export function injectAutoLinks(htmlContent: string): string {
  let result = htmlContent;

  const sortedRules = [...linkRules].sort((a, b) => b.term.length - a.term.length);

  sortedRules.forEach(rule => {
    const regex = new RegExp(`(?<!<[^>]*)(${rule.term})(?![^<]*>)`, 'g');
    
    let count = 0;
    result = result.replace(regex, (match) => {
      count++;
      if (count <= 2) {
        return `<a href="${rule.slug}" class="text-rose-500 font-bold hover:text-white transition-colors underline decoration-rose-500/30 underline-offset-4" title="${rule.term} Hakkında Bilgi">${match}</a>`;
      }
      return match;
    });
  });

  return result;
}
