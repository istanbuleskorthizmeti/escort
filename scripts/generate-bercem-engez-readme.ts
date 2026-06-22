import * as fs from 'fs';
import * as path from 'path';
import { istanbulCity } from '../lib/locations-registry/istanbul';
import { callGemini } from './utils/gemini-client';

const HOST = 'istanbulescort.blog';
const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';
const BRAND_FOLDER_NAME = 'readme-docs-bercem-engez';
const DEFAULT_CATEGORY = 'bercem-engez-vip';

const RANDOM_ADJECTIVES = [
  "Premium VIP Partner", "Elit Model", "Bireysel Özel Refakatçi", "VIP Sarışın Model",
  "Ateşli Tanrıça", "Nefes Kesen Model", "Lüks Bağımsız Partner", "Eşsiz Eşlik Hizmeti"
];

const ADULT_RACES = ["Turkish", "European", "Latina", "Russian"];
const ADULT_CATEGORIES = ["VIP Escort", "Kaporasız Escort", "Üniversiteli Escort", "Model Escort"];
const ADULT_NICHES = ["Outdoor", "Office", "Hotel", "Luxury Rezidans", "Elite Ortamlar"];
const ADULT_QUALITIES = ["Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız", "4K Ultra HD"];

const FEMALE_NAMES = [
  "Berçem", "Aylin", "Buse", "Ceren", "Derin", "Ece", "Figen", "Gizem", "Hande", "İrem",
  "Jale", "Kübra", "Lara", "Merve", "Nihan", "Özge", "Pelin", "Rüya", "Selin", "Tuğçe",
  "Yasemin", "Zehra", "Aslı", "Begüm", "Cansel", "Didem", "Elif", "Gamze", "Hülya", "Melisa",
  "Aynur", "Svetlana", "Ayla", "Esila", "Berfin", "Dilan", "Jînda", "Narin", "Rojîn", "Zilan",
  "Asya", "Damla", "Işıl", "Leyla", "Bahar", "Banu", "Cemre", "Defne", "Ebru", "Eylül",
  "Filiz", "Gaye", "Hale", "Iraz", "Jülide", "Kader", "Lale", "Mine", "Naz", "Oya",
  "Pınar", "Seda", "Şebnem", "Tanya", "Ülkü", "Vildan", "Yeliz", "Zuhal"
];

const P1_TEMPLATES = [
  "**{sehir} {ilce}** bölgesinde tamamen özgün ve profesyonel refakat standartlarını arayan seçkin beyler için **{primaryName}** VIP hizmetlerini listeledik. Bu sayfadaki profiller ve detaylar, {sehir} genelinde {hizmet} sunan üst düzey hizmet kalitesini içerir.",
  "Eğer benzersiz, elit ve güvenilir bir eşlik deneyimi arıyorsanız, **{sehir} {ilce}** bölgesinde **{primaryName}** VIP ilanları tam size göre. En özel ve {luks} anlar için doğrulanmış görselleri ve detayları inceleyebilirsiniz.",
  "**{sehir} {ilce}** bölgesinde en çok tercih edilen bağımsız {secenek} listesinde **{primaryName}** ön plana çıkmaktadır. Size en üst düzeyde kalite, {luks} ve gizlilik vaat eden seçkin profilleri burada bulacaksınız."
];

const P2_TEMPLATES = [
  "Tüm görüşmeler tamamen {niche} konseptinde, kaporasız buluşma garantisiyle gerçekleştirilir. Yüksek kaliteli ve {luks} bir refakat deneyimi için **{primaryName}** profil detaylarını inceleyebilirsiniz.",
  "Rezervasyon ve buluşma süreçlerinde güvenlik ile gizlilik en hassas kuralımızdır. Bu bölgedeki bağımsız VIP profiller, {niche} ortamlarda randevu kabul etmekte ve kapora talep etmemektedir. Güvenilir bir randevu oluşturmak için yönlendirme bağlantılarını kullanabilirsiniz."
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
    .replace(/{secenek}/g, () => getRandom(['escort bayan', 'VIP refakatçi', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandom(['VIP escort hizmeti', 'doğrulanmış eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandom(['kaporasız escort ilanları', 'bireysel escort bayan vitrini', 'VIP eskort seçenekleri']))
    .replace(/{luks}/g, () => getRandom(['lüks', 'elit', 'ayrıcalıklı', 'gerçek fotoğraflı']));

  // Embed backlink to dorukcanay.digital on primary keywords
  result = result
    .replace(/\*\*İstanbul Escort\*\*/g, '**[İstanbul Escort](https://dorukcanay.digital)**')
    .replace(/\*\*Istanbul Escort\*\*/g, '**[Istanbul Escort](https://dorukcanay.digital)**');

  return result.replace(/\s+/g, ' ').replace(/\s+([.,!?;])/g, '$1').trim();
}

function generateMarkdownContent(sehir: string, ilce: string, pathCounter: number, categorySlug: string, geminiText: string = ''): string {
  const primaryName = FEMALE_NAMES[pathCounter % FEMALE_NAMES.length];

  const context = {
    race: getRandom(ADULT_RACES),
    category: getRandom(ADULT_CATEGORIES),
    niche: getRandom(ADULT_NICHES),
    adj: getRandom(RANDOM_ADJECTIVES),
    quality: getRandom(ADULT_QUALITIES)
  };

  const title = ilce
    ? `${sehir} ${ilce} Escort | ${primaryName} VIP İlanları`
    : `${sehir} Escort | %100 Gerçek ve Kaporasız ${primaryName} VIP Hizmeti`;

  const p1 = parseSpin(getRandom(P1_TEMPLATES), sehir, ilce, context, primaryName);
  const p2 = parseSpin(getRandom(P2_TEMPLATES), sehir, ilce, context, primaryName);
  const featuredQualities = [getRandom(ADULT_QUALITIES), getRandom(ADULT_QUALITIES), getRandom(ADULT_QUALITIES), getRandom(ADULT_QUALITIES)];

  let profilesShowcase = "\n## 👑 Öne Çıkan VIP Profil Kataloğu (25 Bağımsız Model):\n\n";
  profilesShowcase += `| **🔥 VIP MODEL** | **👑 PREMIUM PARTNER** | **✨ ELİT EŞLİK** | **💎 VIP SEÇENEK** | **🌟 GÜVENLİ MODEL** |\n`;
  profilesShowcase += `| :---: | :---: | :---: | :---: | :---: |\n`;

  const gridFemaleNames = [
    "Aylin", "Buse", "Ceren", "Derin", "Ece", "Figen", "Gizem", "Hande", "İrem", "Jale",
    "Kübra", "Lara", "Merve", "Nihan", "Özge", "Pelin", "Rüya", "Selin", "Tuğçe", "Umut",
    "Verda", "Yasemin", "Zehra", "Aslı", "Begüm", "Cansel", "Didem", "Elif", "Gamze", "Hülya"
  ];

  let cells: string[] = [];
  for (let i = 1; i <= 25; i++) {
    if (i === 13) {
      // Reklam Vermek İçin Tıklayınız! banner cell
      const cellText = `**Reklam Vermek İçin Tıklayınız!**<br>[![Reklam Ver](https://${HOST}/vitrin/reklam-ver-banner.png)](https://${HOST}/go/reklam-ver)<br>_Kendi ilanınızı ekleyin_<br>_Hemen Reklam Verin_<br>**[İletişim İçin Tıklayın](https://${HOST}/go/reklam-ver)**`;
      cells.push(cellText);
      continue;
    }
    
    // Shift index slightly for normal profiles since cell 13 is replaced
    const profileIndex = i < 13 ? i : i - 1;
    const pName = profileIndex === 1 ? primaryName : gridFemaleNames[(profileIndex - 2 + pathCounter) % gridFemaleNames.length];
    const pRace = getRandom(ADULT_RACES);
    const pAdj = getRandom(RANDOM_ADJECTIVES);
    const pQual = getRandom(ADULT_QUALITIES);
    const pNiche = getRandom(ADULT_NICHES);
    const pUrl = `https://${HOST}/go/${slugify(pName)}`;
    const pImg = profileIndex === 1
      ? `https://${HOST}/_media/vitrin/bercem-engez.png`
      : `https://${HOST}/_media/vitrin/vip-profil-${((profileIndex - 2) % 6) + 1}.webp`;

    const cellText = `**${pName}** (${pRace})<br>![${pName} - ${pAdj}](${pImg})<br>_${pAdj}_<br>_Hizmet: ${pNiche}_<br>**[${pQual}](${pUrl})**`;
    cells.push(cellText);
  }

  for (let row = 0; row < 5; row++) {
    profilesShowcase += `| ${cells[row * 5]} | ${cells[row * 5 + 1]} | ${cells[row * 5 + 2]} | ${cells[row * 5 + 3]} | ${cells[row * 5 + 4]} |\n`;
  }
  profilesShowcase += `\n---\n\n`;

  const cleanIlce = ilce ? ` ${ilce}` : "";
  const nameLower = primaryName.toLowerCase();
  const kws = [
    `${nameLower}`, `${nameLower} escort`, `${nameLower} eskort`,
    `${sehir}${cleanIlce} escort`, `${sehir}${cleanIlce} eskort`, `${sehir}${cleanIlce} escort bayan`,
    `${sehir} eve gelen escort`, `${sehir} otele servis escort`, `${sehir} eskort telefonları`
  ];

  const linkUrl = ilce ? `https://${HOST}/istanbul/${slugify(ilce)}` : `https://${HOST}`;
  const tagCloud = kws.map((k) => `**[${k}](${linkUrl})**`).join(' • ');

  const excerpt = ilce
    ? `${ilce} bölgesinde kaporasız ve elden ödemeli ${primaryName} VIP model ilanları. En popüler ${ilce} eskort bayan vitrini.`
    : `${sehir} geneli kaporasız ve elden ödemeli ${primaryName} VIP model ilanları. En popüler ${sehir} eskort bayan vitrini ve bağımsız partner rehberi.`;

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

${geminiText ? `> **📍 Coğrafi ve Yerel Rehber:** ${geminiText}\n\n` : ''}${p1}

${profilesShowcase}

${p2}

---
### 📍 Popüler Arama Başlıkları:
${tagCloud}
`;
}

export async function buildBercemEngezProject(categorySlug: string = DEFAULT_CATEGORY) {
  const folderPath = path.join(DESKTOP_PATH, BRAND_FOLDER_NAME);
  
  console.log(`🔨 Building 'readme' Markdown project at: ${folderPath}`);
  fs.mkdirSync(folderPath, { recursive: true });

  let pathCounter = 0;

  // 0. General Landing Page
  console.log("📝 Generating main landing page: bercem-engez.md");
  const mainContent = generateMarkdownContent("İstanbul", "", pathCounter, categorySlug, "");
  fs.writeFileSync(path.join(folderPath, `bercem-engez.md`), mainContent);
  pathCounter++;

  const processedDistricts = new Set<string>();

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);

    if (processedDistricts.has(districtSlug)) continue;
    processedDistricts.add(districtSlug);

    // 1. District-level page
    const geminiText = await callGemini(cleanDistrictName, "");
    const distContent = generateMarkdownContent("İstanbul", cleanDistrictName, pathCounter, categorySlug, geminiText);
    fs.writeFileSync(path.join(folderPath, `istanbul-${districtSlug}-bercem-engez.md`), distContent);
    pathCounter++;

    // 2. Neighborhood-level pages
    const processedNeighborhoods = new Set<string>();
    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);
      if (processedNeighborhoods.has(neighborhoodSlug)) continue;
      processedNeighborhoods.add(neighborhoodSlug);

      const searchTarget = `${cleanDistrictName} ${neighborhood.name}`;
      const nGeminiText = await callGemini(searchTarget, "");
      const nContent = generateMarkdownContent("İstanbul", searchTarget, pathCounter, categorySlug, nGeminiText);
      fs.writeFileSync(path.join(folderPath, `istanbul-${districtSlug}-${neighborhoodSlug}-bercem-engez.md`), nContent);
      pathCounter++;
    }
  }

  console.log(`✨ Generated ${pathCounter} ReadMe-compatible Markdown files for Berçem Engez.`);
}

if (require.main === module) {
  const catArg = process.argv.slice(2).find(arg => arg.startsWith('--category='));
  const category = catArg ? catArg.split('=')[1] : DEFAULT_CATEGORY;
  buildBercemEngezProject(category).catch(console.error);
}
