import * as fs from 'fs';
import * as path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';
import { callGemini } from './utils/gemini-client';
import { vitrinImages } from '../lib/vitrin-images';

const HOST = 'istanbulescort.blog';
const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const BRAND_FOLDER_NAME = 'readme-docs-dorukcanay';
const DEFAULT_CATEGORY = 'dorukcanay-vip';

const RANDOM_ADJECTIVES = [
  "Vip Ateşli Eskort", "Eskort Kraliçe Randevu", "Premium Sarışın Model",
  "Nefes Kesen Tanrıça", "Gizemli Vip Partner", "Sultan Refakatçi", "Muhteşem Partner", "Unutulmaz Eşlikçi"
];

const EMOTIONS = ["ateşli", "gizli", "lüks", "%100 gerçek", "Vip", "kraliçe", "sultan", "muhteşem", "unutulmaz"];
const EMOJIS = ["❤️", "🔥", "👑", "💎", "🌹", "💋", "✨", "😈"];

const ADULT_RACES = ["Turkish", "European", "Latina", "Russian"];
const ADULT_CATEGORIES = ["Vip Escort", "Kaporasız Escort", "Üniversiteli Escort", "Model Escort"];
const ADULT_NICHES = ["Luxury Hotel", "Elite Residence", "Private Suite", "Vip Meeting"];
const ADULT_QUALITIES = ["Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız", "4K Ultra HD"];

const FEMALE_NAMES = [
  "Derin", "Melisa", "Svetlana", "Aylin", "Buse", "Ceren", "Ece", "Gizem", "Hande", "İrem",
  "Lara", "Merve", "Nihan", "Özge", "Pelin", "Selin", "Tuğçe", "Yasemin", "Aslı", "Begüm",
  "Didem", "Elif", "Gamze", "Melis", "Aynur", "Ayla", "Esila", "Narin", "Rojîn", "Zilan",
  "Asya", "Damla", "Işıl", "Leyla", "Bahar", "Defne", "Ebru", "Eylül", "Cemre", "Naz"
];

const P1_TEMPLATES = [
  "**{sehir} {ilce}** çevresinde tamamen {emo} ve {luks} bir deneyim arayan seçkin misafirlerimiz için **{primaryName}** Vip refakat seçeneklerini sunuyoruz. Bu platformdaki bağımsız ilanların tamamı, {sehir} genelinde {hizmet} veren teyitli ve profesyonel modellerden oluşmaktadır.",
  "Eğer kendinize unutulmaz, elit ve son derece keyifli bir buluşma hediye etmek istiyorsanız, **{sehir} {ilce}** {ilan} beklentilerinizin çok ötesinde bir hizmet sunacaktır. **{primaryName}** ile en seçkin ve {luks} ortamları paylaşmak için güncel listelerimizi şimdi detaylıca inceleyin.",
  "**{sehir} {ilce}** bölgesinde en yüksek tavsiye oranına sahip olan bağımsız {secenek} listesinde **{primaryName}** zarafeti ve kalitesiyle fark yaratmaktadır. Size özel, güvenli, konforlu ve {luks} bir refakat vaat eden teyitli model profilleri burada yer almaktadır.",
  "Seçkin partner arayışınızı taçlandırmak adına, **{sehir} {ilce}** bölgesinin en prestijli {secenek} profili olan **{primaryName}** ile tanışın. Karşılıklı saygı ve gizlilik odaklı, son derece {emo} ve {luks} bir buluşma gerçekleştirmek için doğrudan iletişim kurabilirsiniz.",
  "Sıradan ilan sitelerindeki sahte görsellerden sıkıldıysanız, **{sehir} {ilce}** genelinde tamamen gerçek fotoğraflı ve kaporasız çalışan **{primaryName}** Vip vitrinimizi çok beğeneceksiniz. En özel anlarınızı {luks} ve güvenli kılmak için buradayız.",
  "**{sehir} {ilce}** lokasyonunda sıradışı bir buluşmaya imza atmak isteyen beyler için **{primaryName}** kusursuz fizikleri ve tecrübeli yaklaşımlarıyla öne çıkıyor. Gerçek dışı ilanlardan uzak, %100 güvenli ve kaporasız {hizmet} için en doğru adrestesiniz.",
  "Her zaman {luks} ve {emo} detaylara önem verenlerin ortak tercihi olan **{primaryName}**, **{sehir} {ilce}** bölgesinde eşsiz anlar vadediyor. Kendinizi şımartmak ve hayatın stresini geride bırakmak adına güncel vitrinimizi inceleyebilirsiniz."
];

const P2_TEMPLATES = [
  "Tüm görüşmeler tamamen kaporasız, ön ödemesiz ve adreste elden nakit ödemeli olarak, {niche} standartlarında gerçekleştirilmektedir. Kusursuz, konforlu ve son derece {luks} bir refakat deneyimi için **{primaryName}** profil detaylarını inceleyip randevunuzu güvenle oluşturabilirsiniz.",
  "Buluşma ve rezervasyon süreçlerinde gizlilik ve karşılıklı güven en hassas kuralımızdır. Bu bölgedeki bağımsız Vip modellerimiz, {niche} ortamlarda randevu kabul etmekte ve sizden asla kapora talep etmemektedir. Güvenilir ve risksiz bir randevu için yönlendirme bağlantılarını kullanabilirsiniz.",
  "Ön ödeme dolandırıcılarından uzak durarak, sıfır maddi risk ile **{sehir} {ilce}** bölgesinde bağımsız model hizmeti alabilirsiniz. Görüşme anında elden ödeme kolaylığı ve {niche} konseptinde sunulan elit refakat ile unutulmaz bir akşam sizleri bekliyor.",
  "Gizliliğinize en üst düzeyde önem veren **{primaryName}**, randevu saatinde belirttiğiniz adreste gecikme yaşamadan yerini alır. Rezidans, lüks otel veya kendi özel alanınızda {niche} standartlarında unutulmaz bir eşlik hizmeti almak için hemen iletişime geçin.",
  "Karşılıklı saygı ve güven çerçevesinde gerçekleşen buluşmalarımızda, en ufak bir ön ödeme şartı aranmaz. **{sehir} {ilce}** genelinde dilediğiniz adrese teyitli servis imkanı sunan bağımsız partnerlerimizle güvenli eskort deneyimini yaşayın.",
  "Hiçbir şekilde ön ödeme yapmadan, tamamen elden nakit ödeme kolaylığıyla **{sehir} {ilce}** escort seçeneklerini değerlendirin. İstediğiniz gün ve saatte rezervasyon oluşturarak {niche} atmosferinin keyfini profesyonel refakat eşliğinde çıkarabilirsiniz.",
  "Güvenliğiniz ve memnuniyetiniz bizim için her şeyden önce gelir. **{primaryName}** ile yapacağınız tüm görüşmelerde kapora talep edilmez, elden ödeme garantisi sunulur. Hemen {niche} kalitesinde bir görüşme ayarlayın."
];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'g')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ç/g, 'c')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

function parseSpin(text: string, sehir: string, ilce: string, context: any, primaryName: string): string {
  const combinedLoc = ilce ? `${sehir} ${ilce}` : sehir;

  let result = text
    .replace(/{sehir}\s+{ilce}/g, combinedLoc)
    .replace(/{sehir}/g, sehir)
    .replace(/{ilce}/g, ilce)
    .replace(/{primaryName}/g, primaryName)
    .replace(/{race}/g, context.race)
    .replace(/{category}/g, context.category)
    .replace(/{niche}/g, context.niche)
    .replace(/{adj}/g, context.adj)
    .replace(/{quality}/g, context.quality)
    .replace(/{emo}/g, () => getRandom(EMOTIONS))
    .replace(/{secenek}/g, () => getRandom(['escort bayan', 'Vip refakatçi', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandom(['Vip escort hizmeti', 'doğrulanmış eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandom(['kaporasız escort ilanları', 'bireysel escort bayan vitrini', 'Vip eskort seçenekleri']))
    .replace(/{luks}/g, () => getRandom(['lüks', 'elit', 'ayrıcalıklı', 'gerçek fotoğraflı']));

  // Embed backlink to dorukcanay.digital on primary keywords
  result = result
    .replace(/\*\*İstanbul Escort\*\*/g, '**[İstanbul Escort](https://dorukcanay.digital)**')
    .replace(/\*\*Istanbul Escort\*\*/g, '**[Istanbul Escort](https://dorukcanay.digital)**');

  return result.replace(/\s+/g, ' ').replace(/\s+([.,!?;])/g, '$1').trim();
}

function generateMarkdownContent(
  sehir: string,
  ilce: string,
  pathCounter: number,
  categorySlug: string,
  geminiText: string = '',
  neighborhoodsList: string[] = []
): string {
  const primaryName = FEMALE_NAMES[pathCounter % FEMALE_NAMES.length];

  const context = {
    race: getRandom(ADULT_RACES),
    category: getRandom(ADULT_CATEGORIES),
    niche: getRandom(ADULT_NICHES),
    adj: getRandom(RANDOM_ADJECTIVES),
    quality: getRandom(ADULT_QUALITIES)
  };

  const currentEmoji = getRandom(EMOJIS);
  const targetEmotion = getRandom(EMOTIONS);

  const title = ilce
    ? `${sehir} ${ilce} Escort Bayan | ${currentEmoji} ${ilce} Eskort Kraliçe Randevu`
    : `${sehir} Escort | %100 Gerçek ve Kaporasız DorukcanAY Vip Hizmeti`;

  const p1 = parseSpin(getRandom(P1_TEMPLATES), sehir, ilce, context, primaryName);
  const p2 = parseSpin(getRandom(P2_TEMPLATES), sehir, ilce, context, primaryName);

  const totalCards = 25;

  // Base64 encoded SVG sponsor banner
  const sponsorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 180" width="130" height="180">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7000ff" stop-opacity="1" />
      <stop offset="100%" stop-color="#ff0055" stop-opacity="1" />
    </linearGradient>
  </defs>
  <rect width="130" height="180" rx="8" fill="url(#grad)" />
  <text x="50%" y="30%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="11" font-weight="bold">📢 REKLAM VER</text>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffe0eb" font-family="system-ui, sans-serif" font-size="7" font-weight="500">Profilini Öne Çıkar</text>
  <rect x="15" y="110" width="100" height="24" rx="12" fill="#ffffff" />
  <text x="50%" y="122" dominant-baseline="middle" text-anchor="middle" fill="#ff0055" font-family="system-ui, sans-serif" font-size="8" font-weight="bold">Hemen Katıl</text>
</svg>`;
  const sponsorSvgBase64 = Buffer.from(sponsorSvg).toString('base64');
  const sponsorImgSrc = `data:image/svg+xml;base64,${sponsorSvgBase64}`;

  // Seeded deterministic shuffle of vitrinImages database
  let seed = 2166136261;
  const seedString = `${ilce || 'istanbul'}-${pathCounter}`;
  for (let i = 0; i < seedString.length; i++) {
    seed = seed ^ seedString.charCodeAt(i);
    seed = Math.imul(seed, 16777619);
  }

  const shuffledPool = [...vitrinImages];
  let currentSeed = seed;
  for (let i = shuffledPool.length - 1; i > 0; i--) {
    currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
    const j = Math.abs(currentSeed) % (i + 1);
    const temp = shuffledPool[i];
    shuffledPool[i] = shuffledPool[j];
    shuffledPool[j] = temp;
  }

  let vitrinHtml = '';

  // Section 1: Premium Escort Vitrini (İlk 10 Model)
  vitrinHtml += `\n## 👑 ${sehir} ${ilce ? `${ilce} ` : ''}Premium Escort İlan Vitrini (İlk 10 Model):\n\n`;
  for (let idx = 0; idx < 10; idx++) {
    const model = shuffledPool[idx % shuffledPool.length] || vitrinImages[idx % vitrinImages.length];
    let rawTitle = model.title || 'Vip Partner';
    let pName = rawTitle;
    if (
      /vip|model|partner|türbanlı|olgun|çıtır|lady|analiz|yabancı|rus|doğrulanmış/i.test(rawTitle) || 
      rawTitle.toUpperCase() === rawTitle
    ) {
      const deterministicNameIdx = Math.abs(seed + idx) % FEMALE_NAMES.length;
      pName = FEMALE_NAMES[deterministicNameIdx];
    } else {
      pName = rawTitle.split(' ')[0];
    }

    const pAge = model.age || (20 + (idx % 8));
    const pNiche = model.niche || getRandom(ADULT_NICHES);
    const pImgSrc = model.src.startsWith('http') 
      ? model.src 
      : `https://${HOST}${model.src.startsWith('/') ? '' : '/'}${model.src}`;

    vitrinHtml += `### 👑 ${pName} - Premium Escort\n`;
    vitrinHtml += `![${pName} - ${ilce || 'İstanbul'} Premium](${pImgSrc})\n\n`;
    vitrinHtml += `*   **İsim / Yaş:** ${pName} (${pAge} Yaşında)\n`;
    vitrinHtml += `*   **Durum:** 🟢 %100 Doğrulanmış Gerçek Görsel\n`;
    vitrinHtml += `*   **Hizmet Alanı:** 🏡 Ev • 🏨 Otel • 🏢 Rezidans\n`;
    vitrinHtml += `*   **Hizmet Konsepti:** ${pNiche}\n`;
    vitrinHtml += `*   **İletişim & Rezervasyon:** **[✨ İletişime Geç & Randevu Al (WhatsApp)](https://dorukcanay.digital/whatsapp)**\n`;

  }

  // Section 2: Gold Escort Vitrini (Ek 5 Model)
  vitrinHtml += `\n## 💎 ${sehir} ${ilce ? `${ilce} ` : ''}Gold Escort İlan Vitrini (Ek 5 Model):\n\n`;
  for (let idx = 10; idx < 15; idx++) {
    const model = shuffledPool[idx % shuffledPool.length] || vitrinImages[idx % vitrinImages.length];
    let rawTitle = model.title || 'Vip Partner';
    let pName = rawTitle;
    if (
      /vip|model|partner|türbanlı|olgun|çıtır|lady|analiz|yabancı|rus|doğrulanmış/i.test(rawTitle) || 
      rawTitle.toUpperCase() === rawTitle
    ) {
      const deterministicNameIdx = Math.abs(seed + idx) % FEMALE_NAMES.length;
      pName = FEMALE_NAMES[deterministicNameIdx];
    } else {
      pName = rawTitle.split(' ')[0];
    }

    const pAge = model.age || (20 + (idx % 8));
    const pNiche = model.niche || getRandom(ADULT_NICHES);
    const pImgSrc = model.src.startsWith('http') 
      ? model.src 
      : `https://${HOST}${model.src.startsWith('/') ? '' : '/'}${model.src}`;

    vitrinHtml += `### ✨ ${pName} - Gold Eskort\n`;
    vitrinHtml += `![${pName} - ${ilce || 'İstanbul'} Gold](${pImgSrc})\n\n`;
    vitrinHtml += `*   **İsim / Yaş:** ${pName} (${pAge} Yaşında)\n`;
    vitrinHtml += `*   **Durum:** 🟢 %100 Doğrulanmış Gerçek Görsel\n`;
    vitrinHtml += `*   **Hizmet Alanı:** 🏡 Ev • 🏨 Otel • 🏢 Rezidans\n`;
    vitrinHtml += `*   **Hizmet Konsepti:** ${pNiche}\n`;
    vitrinHtml += `*   **İletişim & Rezervasyon:** **[✨ İletişime Geç & Randevu Al (WhatsApp)](https://dorukcanay.digital/whatsapp)**\n`;

  }

  // Dynamic Neighborhood list insertion for grouping nearby locations
  let neighborhoodSection = '';
  if (neighborhoodsList.length > 0) {
    neighborhoodSection += `\n### ${getRandom(EMOJIS)} ${ilce} Bölgesinde Hizmet Verilen Çevre Mahalleler:\n`;
    neighborhoodSection += `Bu sayfadaki bağımsız Vip eskort modellerimiz, **${ilce}** genelinde ve özellikle aşağıdaki yakın çevre bölgelerinde adrese/otele hizmet sunmaktadır:\n\n`;
    neighborhoodSection += neighborhoodsList.map(n => `*   **${n} Mahallesi Escort**`).join('\n') + `\n\n`;
  }

  const cleanIlce = ilce ? ` ${ilce}` : "";
  const kws = [
    `dorukcanay`, `dorukcanay escort`, `dorukcanay eskort`,
    `${sehir}${cleanIlce} escort`, `${sehir}${cleanIlce} eskort`, `${sehir}${cleanIlce} escort bayan`,
    `${sehir} eve gelen escort`, `${sehir} otele servis escort`, `${sehir} eskort telefonları`
  ];

  // Dynamically inject target marketing keywords from the Ads & Trends Intelligence engine
  const marketingKwPath = path.join(__dirname, '..', 'data', 'target-marketing-keywords.json');
  if (fs.existsSync(marketingKwPath)) {
    try {
      const marketingKws = JSON.parse(fs.readFileSync(marketingKwPath, 'utf8')) as string[];
      if (Array.isArray(marketingKws)) {
        for (const kw of marketingKws) {
          const dynamicKw = kw.replace(/{ilce}/gi, ilce || '').replace(/{sehir}/gi, sehir).trim();
          if (dynamicKw && !kws.includes(dynamicKw)) {
            kws.push(dynamicKw);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load marketing keywords:', e);
    }
  }

  const linkUrl = `https://dorukcanay.digital`;
  const tagCloud = kws.map((k) => `**[${k}](${linkUrl})**`).join(' • ');

  const excerpt = ilce
    ? `${ilce} bölgesinde kaporasız ve elden ödemeli muhteşem DorukcanAY Vip model escort ilanları. En popüler ${ilce} eskort bayan vitrini.`
    : `İstanbul genelinde kaporasız ve elden ödemeli muhteşem DorukcanAY Vip model escort ilanları. En popüler İstanbul eskort bayan vitrini.`;

  const frontmatter = `---
title: ${JSON.stringify(title)}
excerpt: ${JSON.stringify(excerpt)}
category: ${JSON.stringify(categorySlug)}
hidden: false
order: ${pathCounter}
metadata:
  title: ${JSON.stringify(title)}
  description: ${JSON.stringify(excerpt)}
  robots: "index"
---
`;

  function generateIstanbulProvinceSeoContent(): string {
    let content = `\n## 🗺️ İstanbul Geneli İlçe ve Mahalle Vip Escort Rehberi\n\n`;
    content += `İstanbul genelinde hem Avrupa Yakası hem de Anadolu Yakası'nda hizmet veren teyitli ve bağımsız **Vip eskort** partnerlerimize ulaşmak artık çok kolay. DorukcanAY güvencesiyle hiçbir ön ödeme (kapora) yapmadan adrese ve otele hizmet veren modellerimizin listesine aşağıdaki ilçelerden ulaşabilirsiniz:\n\n`;

    const popularDistricts = ["Esenyurt", "Şişli", "Beşiktaş", "Kadıköy", "Bakırköy", "Beylikdüzü", "Ataşehir", "Ümraniye", "Fatih"];
    
    content += `### 🌟 Öne Çıkan Popüler Hizmet Bölgeleri:\n\n`;
    for (const distName of popularDistricts) {
      const matchedDist = istanbulCity.districts.find(d => d.name.toLowerCase() === distName.toLowerCase());
      if (matchedDist) {
        const cleanName = matchedDist.name.replace(/\s+escort/gi, '').trim();
        const slug = slugify(cleanName);
        const randomNeighborhoods = matchedDist.neighborhoods.slice(0, 3).map(n => `${n.name} Mahallesi`).join(', ');
        
        content += `*   **[${cleanName} Escort](/docs/istanbul-${slug}-escort)**: **${cleanName}** genelinde ve özellikle *${randomNeighborhoods}* çevrelerinde evde veya lüks otelde eşlik edebilecek teyitli **${cleanName} eskort** bayan alternatifleri.\n`;
      }
    }

    content += `\n### 📍 Diğer Tüm Hizmet Verdiğimiz İstanbul İlçeleri:\n\n`;
    content += `Aşağıdaki ilçelerin tamamında bağımsız Vip model eskort bayan ilanlarımıza göz atarak güvenli ve kaporasız buluşma ayarlayabilirsiniz:\n\n`;

    const items: string[] = [];
    for (const dist of istanbulCity.districts) {
      const cleanName = dist.name.replace(/\s+escort/gi, '').trim();
      if (popularDistricts.includes(cleanName)) continue;
      const slug = slugify(cleanName);
      items.push(`*   **[${cleanName} Eskort](/docs/istanbul-${slug}-escort)**`);
    }
    content += items.join('\n') + `\n\n`;
    
    return content;
  }

const googleSitesList = [
  { name: "Sefaköy İstanbul Escort", url: "https://sites.google.com/dorukcanay.digital/sefakoyistanbul-drkcnay2026/ana-sayfa" },
  { name: "Bakırköy Escort", url: "https://sites.google.com/dorukcanay.digital/bakrkyescort-drkcnayv1/ana-sayfa" },
  { name: "Çatalca Escort", url: "https://sites.google.com/dorukcanay.digital/catalca-escort-drkcnay1-v/ana-sayfa" },
  { name: "Beylikdüzü Vip Escort", url: "https://sites.google.com/dorukcanay.digital/beylikduzu-vip-escort/ana-sayfa" },
  { name: "Beşyol Üniversiteli Escort", url: "https://sites.google.com/dorukcanay.digital/besyol-universiteli-escort/ana-sayfa" },
  { name: "Beşyol Escort", url: "https://sites.google.com/dorukcanay.digital/besyol-escort-drkcnay1-v/ana-sayfa" },
  { name: "İstanbul Escort", url: "https://sites.google.com/dorukcanay.digital/istanbul-escort/ana-sayfa" },
  { name: "Sancaktepe Escort", url: "https://sites.google.com/dorukcanay.digital/sancaktepe-escort-drkcnay1-v/ana-sayfa" },
  { name: "Kartal Escort", url: "https://sites.google.com/dorukcanay.digital/kartal-escort-drkcnay1-v/ana-sayfa" },
  { name: "Çekmeköy Escort", url: "https://sites.google.com/dorukcanay.digital/cekmekoy-escort-drkcnay1-v/ana-sayfa" },
  { name: "Arnavutköy Escort", url: "https://sites.google.com/dorukcanay.digital/arnavutkoy-escort-drkcnay1-v/ana-sayfa" },
  { name: "Başakşehir Escort", url: "https://sites.google.com/dorukcanay.digital/basaksehir-escort-drkcnay1-v/ana-sayfa" },
  { name: "Esenler Escort", url: "https://sites.google.com/dorukcanay.digital/esenler-escort-drkcnay1-v/ana-sayfa" },
  { name: "Adalar Escort", url: "https://sites.google.com/dorukcanay.digital/adalar-escort-drkcnay1-v/ana-sayfa" },
  { name: "Silivri Escort", url: "https://sites.google.com/dorukcanay.digital/silivriescort-drkcnay2026/ana-sayfa" },
  { name: "Beyoğlu Escort", url: "https://sites.google.com/dorukcanay.digital/beyoglu-escort-drkcnay1-v/ana-sayfa" }
];

function generateGoogleSitesLinkHub(): string {
  let content = `\n## 🌐 Alternatif Mobil ve Uydu İlan Portalları\n\n`;
  content += `Aşağıdaki alternatif Google Sites mobil ve uydu portalları üzerinden de bölgenizdeki kaporasız VIP partner vitrinlerimize erişebilirsiniz:\n\n`;
  for (const site of googleSitesList) {
    content += `*   **[${site.name}](${site.url})**\n`;
  }
  content += `\n`;
  return content;
}

  return `${frontmatter}

# ${title}

${geminiText ? `> **📍 Coğrafi ve Yerel Rehber:** ${geminiText}\n\n` : ''}${p1}

${vitrinHtml}

${neighborhoodSection}

${!ilce ? generateIstanbulProvinceSeoContent() + generateGoogleSitesLinkHub() : ''}

---
### 📍 Popüler Arama Başlıkları:
${tagCloud}
`;
}

export async function buildDorukcanayProject(categorySlug: string = DEFAULT_CATEGORY) {
  const folderPath = path.join(DESKTOP_PATH, BRAND_FOLDER_NAME);

  console.log(`🔨 Building 'DorukcanAY' Markdown project at: ${folderPath}`);

  // Clean target directory first to prevent orphan files when transitioning
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
  fs.mkdirSync(folderPath, { recursive: true });

  let pathCounter = 0;

  // 0. General Landing Page
  console.log("📝 Generating main landing page: istanbul-escort.md");
  const mainContent = generateMarkdownContent("İstanbul", "", pathCounter, categorySlug, "");
  fs.writeFileSync(path.join(folderPath, `istanbul-escort.md`), mainContent);
  pathCounter++;

  const processedDistricts = new Set<string>();

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);

    if (processedDistricts.has(districtSlug)) continue;
    processedDistricts.add(districtSlug);

    // Extract sibling neighborhood names for grouping
    const neighborhoodNames = district.neighborhoods.map(n => n.name);

    // 1. District-level page containing all grouped neighborhoods
    console.log(`⏳ Generating grouped page for: ${cleanDistrictName}`);
    const geminiText = await callGemini(cleanDistrictName, "");
    const distContent = generateMarkdownContent(
      "İstanbul",
      cleanDistrictName,
      pathCounter,
      categorySlug,
      geminiText,
      neighborhoodNames
    );
    fs.writeFileSync(path.join(folderPath, `istanbul-${districtSlug}-escort.md`), distContent);
    pathCounter++;
  }

  const extraDistricts = [
    {
      sehir: "Tekirdağ",
      name: "Çerkezköy",
      neighborhoods: [
        "Kızılpınar", "Veliköy", "Fevzipaşa", "Gazi Mustafa Kemal Paşa",
        "Yıldırım Beyazıt", "Bağlık", "İstasyon", "Cumhuriyet", "Fatih", "Tepe"
      ]
    }
  ];

  for (const district of extraDistricts) {
    const cleanDistrictName = district.name;
    const districtSlug = slugify(cleanDistrictName);
    const neighborhoodNames = district.neighborhoods;

    console.log(`⏳ Generating grouped page for: ${cleanDistrictName} (${district.sehir})`);
    const geminiText = await callGemini(cleanDistrictName, "");
    const distContent = generateMarkdownContent(
      district.sehir,
      cleanDistrictName,
      pathCounter,
      categorySlug,
      geminiText,
      neighborhoodNames
    );
    const citySlug = slugify(district.sehir);
    fs.writeFileSync(path.join(folderPath, `${citySlug}-${districtSlug}-escort.md`), distContent);
    pathCounter++;
  }

  console.log(`✨ Generated ${pathCounter} ReadMe-compatible Markdown files for DorukcanAY.`);
}

if (require.main === module) {
  const catArg = process.argv.slice(2).find(arg => arg.startsWith('--category='));
  const category = catArg ? catArg.split('=')[1] : DEFAULT_CATEGORY;
  buildDorukcanayProject(category).catch(console.error);
}
