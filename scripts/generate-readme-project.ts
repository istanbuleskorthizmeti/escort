import * as fs from 'fs';
import * as path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';

const HOST = 'istanbulescort.blog';
const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const DEFAULT_CATEGORY = 'istanbul-escorts';

const ORIGINAL_VITRIN = [
  { name: 'Melissa', img: 'istanbul-kaporasiz-escort-melissa-1.webp', race: 'Turkish', cat: 'Elite VIP Partner' },
  { name: 'Aynur', img: 'istanbul-kaporasiz-escort-aynur-1.webp', race: 'Turkish', cat: 'VIP Sarışın Model' },
  { name: 'Svetlana', img: 'istanbul-kaporasiz-escort-svetlana-1.webp', race: 'Russian', cat: 'Elit Rus Model' },
  { name: 'Ceren', img: 'istanbul-kaporasiz-escort-ceren-1.webp', race: 'Turkish', cat: 'VIP Elit Model' }
];

const ADULT_RACES = ["Turkish", "Russian", "Asian", "Ebony", "Latina", "European", "Ukrainian", "Belarusian", "Arab", "Persian"];
const ADULT_CATEGORIES = ["Anal", "BDSM", "MILF", "Teen", "Threesome", "Sınırsız Escort", "Kaporasız Escort", "Üniversiteli Escort", "Model Escort"];
const ADULT_NICHES = ["Outdoor", "Office", "Gym", "Hotel", "Massage", "Spa", "Luxury", "Elite", "VIP", "Kaporasız", "Güvenilir"];
const ADULT_PROFILE_ADJECTIVES = ["Ateşli", "Sıcak", "Nefes Kesen", "Baştan Çıkarıcı", "Vahşi", "Doyumsuz", "Kışkırtıcı", "Egzotik", "Tanrıça", "Elite", "VIP"];
const ADULT_QUALITIES = ["4K Ultra HD", "1080p Full HD", "Sansürsüz", "Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız"];

const P1_TEMPLATES = [
  "**{sehir} {ilce}** bölgesinde en sıcak {adj} ve {luks} **İstanbul Escort** hizmeti arayan beyler için doğrulanmış reklam görsellerini listeledik. Bu sayfadaki profiller, {sehir} genelinde {hizmet} sunan bağımsız partnerlerdir.",
  "Günlük hayatın temposuna konforlu bir mola verip kendinize özel anlar yaratmak istiyorsanız, **{sehir} {ilce}** {ilan} tam size göre. Beklentileriniz doğrultusunda, {luks} ve unutulmaz anlar için en iyi **İstanbul Escort** / **Istanbul Escort** seçeneklerini inceleyebilirsiniz.",
  "**{sehir} {ilce}** bölgesinde en çok tercih edilen bağımsız {secenek} listesiyle karşınızdayız. Size en üst düzeyde kalite, {luks} ve gizlilik vaat eden seçkin **İstanbul Escort** ve **Istanbul Escort** profillerinin tüm detaylarını burada bulacaksınız."
];

const P2_TEMPLATES = [
  "Görüşmeler tamamen {niche} konseptinde, kaporasız buluşma garantisiyle gerçekleştirilir. Yüksek kaliteli ve {luks} bir eşlik deneyimi yaşamak için görseller altındaki profilleri inceleyebilirsiniz. En iyi **İstanbul Escort** / **Istanbul Escort** deneyimi için 7/24 kesintisiz hizmet sunulmaktadır.",
  "Rezervasyon ve buluşma süreçlerinde güvenlik ile gizlilik en hassas kuralımızdır. Bu bölgedeki bağımsız VIP profiller, {niche} ortamlarda randevu kabul etmekte ve kapora talep etmemektedir. Güvenilir bir **İstanbul Escort** randevusu oluşturmak için profil kartlarındaki yönlendirme bağlantılarını kullanabilirsiniz."
];

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const slugify = (text: string): string => text.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

function parseSpin(text: string, sehir: string, ilce: string, context: any): string {
  const combinedLoc = ilce ? `${sehir} ${ilce}` : sehir;
  
  let result = text
    .replace(/{sehir}\s+{ilce}/g, combinedLoc)
    .replace(/{sehir}/g, sehir)
    .replace(/{ilce}/g, ilce)
    .replace(/{race}/g, context.race)
    .replace(/{category}/g, context.category)
    .replace(/{niche}/g, context.niche)
    .replace(/{adj}/g, context.adj)
    .replace(/{quality}/g, context.quality)
    .replace(/{secenek}/g, () => getRandom(['escort bayan', 'VIP refakatçi', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandom(['VIP escort hizmeti', 'doğrulanmış eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandom(['kaporasız escort ilanları', 'bireysel escort bayan vitrini', 'VIP eskort seçenekleri']))
    .replace(/{luks}/g, () => getRandom(['lüks', 'elit', 'ayrıcalıklı', 'gerçek fotoğraflı']));

  // Embed backlink to dorukcanay.digital on primary keywords
  result = result
    .replace(/\*\*İstanbul Escort\*\*/g, '**[İstanbul Escort](https://dorukcanay.digital)**')
    .replace(/\*\*Istanbul Escort\*\*/g, '**[Istanbul Escort](https://dorukcanay.digital)**');

  // Clean up any double spaces, trailing/leading spaces, and punctuation spacing
  return result.replace(/\s+/g, ' ').replace(/\s+([.,!?;])/g, '$1').trim();
}

function generateMarkdownContent(sehir: string, ilce: string, pathCounter: number, categorySlug: string): string {
  const context = {
    race: getRandom(ADULT_RACES),
    category: getRandom(ADULT_CATEGORIES),
    niche: getRandom(ADULT_NICHES),
    adj: getRandom(ADULT_PROFILE_ADJECTIVES),
    quality: getRandom(ADULT_QUALITIES)
  };

  const title = ilce
    ? `${sehir} ${ilce} Escort | ${sehir} ${ilce} Eskort Bayan İlanları`
    : `${sehir} Escort | %100 Gerçek ve Kaporasız ${sehir} Eskort Bayan Hizmeti`;

  const p1 = parseSpin(getRandom(P1_TEMPLATES), sehir, ilce, context);
  const p2 = parseSpin(getRandom(P2_TEMPLATES), sehir, ilce, context);
  const featuredQualities = [getRandom(ADULT_QUALITIES), getRandom(ADULT_QUALITIES), getRandom(ADULT_QUALITIES), getRandom(ADULT_QUALITIES)];

  let profilesShowcase = "\n## 👑 Öne Çıkan VIP Partner İlanları:\n\n";
  for (let i = 0; i < 4; i++) {
    const profile = ORIGINAL_VITRIN[i];
    const profileUrl = `https://${HOST}/go/${slugify(profile.name)}`;
    const imageUrl = `https://${HOST}/_media/vitrin/${profile.img}`;
    
    profilesShowcase += `### 🔞 ${profile.name} (${profile.race})\n` +
      `*   **Kategori:** ${profile.cat}\n` +
      `*   **Doğrulama:** **[${featuredQualities[i]}](${profileUrl})**\n` +
      `*   **Detaylı Bilgi:** **[${profile.name} Profilini İncele](https://dorukcanay.digital)**\n\n` +
      `![${profile.name} ${profile.cat}](${imageUrl})\n\n---\n\n`;
  }

  const cleanIlce = ilce ? ` ${ilce}` : "";
  const kws = [
    `${sehir}${cleanIlce} escort`, `${sehir}${cleanIlce} eskort`, `${sehir}${cleanIlce} escort bayan`, `${sehir}${cleanIlce} eskort bayan`,
    `${sehir} eve gelen escort`, `${sehir} otele servis escort`, `${sehir} eskort telefonları`, `${sehir} escort numaraları`,
    `${sehir} güvenilir escort bayanlar`
  ];

  const linkUrl = ilce ? `https://${HOST}/istanbul/${slugify(ilce)}` : `https://${HOST}`;
  const tagCloud = kws.map((k) => `**[${k}](${linkUrl})**`).join(' • ');

  const excerpt = ilce
    ? `${ilce} escort arayanlar için kaporasız ve elden ödemeli VIP model ilanları. En popüler ${ilce} eskort bayan vitrini rehberi.`
    : `${sehir} geneli kaporasız ve elden ödemeli VIP model ilanları. En popüler ${sehir} eskort bayan vitrini ve bağımsız partner rehberi.`;

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

  return `${frontmatter}
# ${title}

${p1}

${profilesShowcase}

${p2}

---
### 📍 Popüler Arama Başlıkları:
${tagCloud}
`;
}

export async function buildReadmeProject(categorySlug: string = DEFAULT_CATEGORY) {
  const folderName = 'readme-docs';
  const folderPath = path.join(DESKTOP_PATH, folderName);
  
  console.log(`🔨 Building 'readme' Markdown project at: ${folderPath}`);
  fs.mkdirSync(folderPath, { recursive: true });

  let pathCounter = 0;

  // 0. General Landing Page for "istanbul-escort" targeting the primary keyword
  console.log("📝 Generating main landing page: istanbul-escort.md");
  const mainContent = generateMarkdownContent("İstanbul", "", pathCounter, categorySlug);
  fs.writeFileSync(path.join(folderPath, `istanbul-escort.md`), mainContent);
  pathCounter++;

  const processedDistricts = new Set<string>();

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);

    if (processedDistricts.has(districtSlug)) continue;
    processedDistricts.add(districtSlug);

    // 1. District-level page
    const distContent = generateMarkdownContent("İstanbul", cleanDistrictName, pathCounter, categorySlug);
    fs.writeFileSync(path.join(folderPath, `istanbul-${districtSlug}-escort.md`), distContent);
    pathCounter++;

    // 2. Neighborhood-level pages
    const processedNeighborhoods = new Set<string>();
    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);
      if (processedNeighborhoods.has(neighborhoodSlug)) continue;
      processedNeighborhoods.add(neighborhoodSlug);

      const searchTarget = `${cleanDistrictName} ${neighborhood.name}`;
      const nContent = generateMarkdownContent("İstanbul", searchTarget, pathCounter, categorySlug);
      fs.writeFileSync(path.join(folderPath, `istanbul-${districtSlug}-${neighborhoodSlug}-escort.md`), nContent);
      pathCounter++;
    }
  }

  console.log(`✨ Generated ${pathCounter} ReadMe-compatible Markdown files.`);
}

if (require.main === module) {
  const catArg = process.argv.slice(2).find(arg => arg.startsWith('--category='));
  const category = catArg ? catArg.split('=')[1] : DEFAULT_CATEGORY;
  buildReadmeProject(category).catch(console.error);
}
