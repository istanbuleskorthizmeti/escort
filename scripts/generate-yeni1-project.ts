import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { istanbulCity } from '../lib/locations-registry/istanbul';

/**
 * ğŸ” BLACK HAT SEO OMNI-GENERATOR - "yeni1" (Markdown Istanbul Edition)
 * Compiles a Stoplight-compatible project (`yeni1.zip`) with separate Markdown (.md) pages.
 * Focuses on Istanbul, generating over 340+ individual SEO-rich pages.
 * Incorporates unique content spinning matrices to eliminate any duplicate content issues.
 * Implements google-site-verification meta tags in markdown frontmatter and root/docs HTML files.
 * Uses the original top 4 profiles (Melissa, Aynur, Svetlana, Ceren) on all pages.
 */

const HOST = 'istanbulescort.blog';
const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';

// Verification Files
const GSC_FILES = [
  { name: 'google909007af5da5c8d5.html', content: 'google-site-verification: google909007af5da5c8d5.html' },
  { name: 'qccx44g5S-nkLQjyo5uIjlGz_STmjbpZ6p5mRdZT50U.html', content: 'google-site-verification: qccx44g5S-nkLQjyo5uIjlGz_STmjbpZ6p5mRdZT50U.html' }
];

const ADULT_RACES = [
  "Turkish", "Russian", "Asian", "Ebony", "Latina", "European", "Ukrainian", "Belarusian", "Arab", "Persian",
  "Uzbek", "Kazakh", "Romanian", "Moldovan", "Brazilian", "Thai", "Japanese", "Korean", "Italian", "Spanish"
];

const ADULT_CATEGORIES = [
  "Anal", "BDSM", "MILF", "Teen", "Threesome", "Orgy", "Gangbang", "Fetish", "Amateur", "Professional",
  "Anal Fantezi", "Dominatrix", "SÄ±nÄ±rsÄ±z Escort", "KaporasÄ±z Escort", "Evli Escort", "Dul Escort", "Ãœniversiteli Escort",
  "Manken Escort", "Model Escort", "Boutique Escort", "Slav Escort", "SarÄ±ÅŸÄ±n Escort", "Esmer Escort"
];

const ADULT_NICHES = [
  "Outdoor", "Office", "Gym", "Hotel", "Massage", "Spa", "Beach", "Public", "Party", "Club", "Luxury", "Elite", "VIP",
  "LÃ¼ks", "Gizli", "KaÃ§amak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "KaporasÄ±z", "GÃ¼venilir"
];

const ADULT_PROFILE_ADJECTIVES = [
  "AteÅŸli", "SÄ±cak", "Nefes Kesen", "BaÅŸtan Ã‡Ä±karÄ±cÄ±", "VahÅŸi", "Doyumsuz", "KÄ±ÅŸkÄ±rtÄ±cÄ±", "Egzotik",
  "TanrÄ±Ã§a", "Afet", "Bomba", "PÄ±rlanta", "Elite", "VIP"
];

const ADULT_QUALITIES = [
  "4K Ultra HD", "1080p Full HD", "SansÃ¼rsÃ¼z", "GerÃ§ek GÃ¶rsel", "Videolu Onay", "CanlÄ± Teyit", "KaporasÄ±z"
];

// Original Top 4 Profiles from original site
const ORIGINAL_VITRIN = [
  { name: 'Melissa', img: 'istanbul-kaporasiz-escort-melissa-1.webp', race: 'Turkish', cat: 'Elite VIP Partner', phone: '905016355053' },
  { name: 'Aynur', img: 'istanbul-kaporasiz-escort-aynur-1.webp', race: 'Turkish', cat: 'VIP SarÄ±ÅŸÄ±n Model', phone: '905016355053' },
  { name: 'Svetlana', img: 'istanbul-kaporasiz-escort-svetlana-1.webp', race: 'Russian', cat: 'Elit Rus Model', phone: '905016355053' },
  { name: 'Ceren', img: 'istanbul-kaporasiz-escort-ceren-1.webp', race: 'Turkish', cat: 'VIP Elit Model', phone: '905016355053' }
];

// Anti-Duplicate content spin templates
const P1_TEMPLATES = [
  "**{sehir} {ilce}** bÃ¶lgesinde en sÄ±cak {adj} ve {luks} **Ä°stanbul Escort** veya **Istanbul Escort** hizmeti arayan beyler iÃ§in doÄŸrulanmÄ±ÅŸ reklam gÃ¶rsellerini listeledik. Bu sayfadaki profiller, {sehir} genelinde {hizmet} sunan baÄŸÄ±msÄ±z partnerlerdir.",
  "GÃ¼nlÃ¼k hayatÄ±n temposuna konforlu bir mola verip kendinize Ã¶zel anlar yaratmak istiyorsanÄ±z, **{sehir} {ilce}** {ilan} tam size gÃ¶re. Beklentileriniz doÄŸrultusunda, {luks} ve unutulmaz anlar iÃ§in en iyi **Ä°stanbul Escort** / **Istanbul Escort** seÃ§eneklerini inceleyebilirsiniz.",
  "**{sehir} {ilce}** bÃ¶lgesinde en Ã§ok tercih edilen baÄŸÄ±msÄ±z {secenek} listesiyle karÅŸÄ±nÄ±zdayÄ±z. Size en Ã¼st dÃ¼zeyde kalite, {luks} ve gizlilik vaat eden seÃ§kin **Ä°stanbul Escort** (Turkish) ve **Istanbul Escort** (English) profillerinin tÃ¼m detaylarÄ±nÄ± burada bulacaksÄ±nÄ±z.",
  "SeÃ§kin ve elit partner arayÄ±ÅŸÄ±nÄ±zÄ± taÃ§landÄ±rmak iÃ§in **{sehir} {ilce}** bÃ¶lgesinin en gÃ¼ncel {secenek} ilanlarÄ±nÄ± tek bir Ã§atÄ± altÄ±nda topladÄ±k. Tamamen {luks} standartlarda hizmet sunan ve yÃ¼ksek memnuniyet garantisi veren **Ä°stanbul Escort** partnerleriyle hemen iletiÅŸime geÃ§ebilirsiniz."
];

const P2_TEMPLATES = [
  "GÃ¶rÃ¼ÅŸmeler tamamen {niche} konseptinde, kaporasÄ±z buluÅŸma garantisiyle gerÃ§ekleÅŸtirilir. YÃ¼ksek kaliteli ve {luks} bir eÅŸlik deneyimi yaÅŸamak iÃ§in gÃ¶rseller altÄ±ndaki profilleri inceleyebilirsiniz. En iyi **Ä°stanbul Escort** / **Istanbul Escort** deneyimi iÃ§in 7/24 kesintisiz hizmet sunulmaktadÄ±r.",
  "Rezervasyon ve buluÅŸma sÃ¼reÃ§lerinde gÃ¼venlik ile gizlilik en hassas kuralÄ±mÄ±zdÄ±r. Bu bÃ¶lgedeki baÄŸÄ±msÄ±z VIP profiller, {niche} ortamlarda randevu kabul etmekte ve kapora talep etmemektedir. GÃ¼venilir bir **Ä°stanbul Escort** randevusu oluÅŸturmak iÃ§in profil kartlarÄ±ndaki yÃ¶nlendirme baÄŸlantÄ±larÄ±nÄ± kullanabilirsiniz.",
  "DoÄŸrulanmÄ±ÅŸ ilanlar ve gerÃ§ek fotoÄŸraflarla desteklenen vitrinimiz, arama motorlarÄ±nda kopya iÃ§erik Ã¼retilmesini engelleyen Ã¶zgÃ¼n algoritmalarla korunmaktadÄ±r. Size en yakÄ±n **{sehir} {ilce} escort** profilini seÃ§erek, kaporasÄ±z ve elden Ã¶deme gÃ¼vencesiyle unutulmaz bir deneyime adÄ±m atÄ±n.",
  "AjansÄ±mÄ±z, en seÃ§kin **{sehir} {ilce} eskort** listesini sunarken karÅŸÄ±lÄ±kli gÃ¼veni esas alÄ±r. Ã–n Ã¶deme veya kapora gibi riskli taleplerle karÅŸÄ±laÅŸmayacaÄŸÄ±nÄ±z, tamamen doÄŸrulanmÄ±ÅŸ ve VIP standartlardaki **Ä°stanbul Escort** profilleriyle keyifli anlarÄ±n tadÄ±nÄ± Ã§Ä±karÄ±n."
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string): string {
  if (!text) return '';
  return text
    .replace(/Ä°/g, 'i')
    .replace(/I/g, 'Ä±')
    .replace(/Ä/g, 'g')
    .replace(/ÄŸ/g, 'g')
    .replace(/Ãœ/g, 'u')
    .replace(/Ã¼/g, 'u')
    .replace(/Å/g, 's')
    .replace(/ÅŸ/g, 's')
    .replace(/Ã–/g, 'o')
    .replace(/Ã¶/g, 'o')
    .replace(/Ã‡/g, 'c')
    .replace(/Ã§/g, 'c')
    .toLowerCase()
    .replace(/Ä±/g, 'i')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseSpin(text: string, sehir: string, ilce: string, context: { race: string, category: string, niche: string, adj: string, quality: string }): string {
  return text
    .replace(/{sehir}/g, sehir)
    .replace(/{ilce}/g, ilce)
    .replace(/{race}/g, context.race)
    .replace(/{category}/g, context.category)
    .replace(/{niche}/g, context.niche)
    .replace(/{adj}/g, context.adj)
    .replace(/{quality}/g, context.quality)
    .replace(/{secenek}/g, () => getRandomElement(['escort bayan', 'VIP refakatÃ§i', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandomElement(['VIP escort hizmeti', 'doÄŸrulanmÄ±ÅŸ eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandomElement(['kaporasÄ±z escort ilanlarÄ±', 'bireysel escort bayan vitrini', 'VIP eskort seÃ§enekleri']))
    .replace(/{luks}/g, () => getRandomElement(['lÃ¼ks', 'elit', 'ayrÄ±calÄ±klÄ±', 'gerÃ§ek fotoÄŸraflÄ±']))
    .replace(/{([^{}]+)}/g, (_, choices) => {
      const arr = choices.split('|');
      return getRandomElement(arr);
    });
}

function generateMarkdownPageContent(sehir: string, ilce: string, pathCounter: number, verificationCode: string): string {
  const race = getRandomElement(ADULT_RACES);
  const category = getRandomElement(ADULT_CATEGORIES);
  const niche = getRandomElement(ADULT_NICHES);
  const adj = getRandomElement(ADULT_PROFILE_ADJECTIVES);
  const quality = getRandomElement(ADULT_QUALITIES);

  const context = { race, category, niche, adj, quality };
  
  // Title featuring specific district/neighborhood with both escort and eskort
  const title = `${ilce} Escort | ${ilce} Eskort Bayan Ä°lanlarÄ±`;

  // Retrieve unique random paragraph templates to protect against duplicate content
  const rawP1 = getRandomElement(P1_TEMPLATES);
  const rawP2 = getRandomElement(P2_TEMPLATES);

  const p1 = parseSpin(rawP1, sehir, ilce, context);
  const p2 = parseSpin(rawP2, sehir, ilce, context);

  // Generate gold keywords tailored to this specific district/neighborhood
  const goldKeywords = [
    `${ilce} escort`,
    `${ilce} eskort`,
    `${ilce} escort bayan`,
    `${ilce} eskort bayan`,
    `istanbul ${ilce} escort`,
    `istanbul ${ilce} eskort`,
    `kaporasÄ±z ${ilce} escort`,
    `kaporasÄ±z ${ilce} eskort`,
    `${ilce} escort bayan ilanlarÄ±`,
    `${ilce} eskort bayan ilanlarÄ±`,
    `${ilce} VIP escort`,
    `${ilce} VIP eskort`,
    `${ilce} eve gelen escort`,
    `${ilce} eve gelen eskort`,
    `${ilce} otelde randevu escort`,
    `${ilce} otelde randevu eskort`,
    `${ilce} escort telefonlarÄ±`,
    `${ilce} eskort telefonlarÄ±`,
    `${ilce} escort numaralarÄ±`,
    `${ilce} eskort numaralarÄ±`,
    `${ilce} en yakÄ±n escort`,
    `${ilce} en yakÄ±n eskort`,
    `${ilce} ucuz escort`,
    `${ilce} ucuz eskort`,
    `${ilce} sÄ±nÄ±rsÄ±z escort`,
    `${ilce} sÄ±nÄ±rsÄ±z eskort`,
    `${ilce} yabancÄ± escort`,
    `${ilce} yabancÄ± eskort`,
    `${ilce} rus escort`,
    `${ilce} rus eskort`,
    `${ilce} anal escort`,
    `${ilce} anal eskort`,
    `${ilce} Ã§Ä±tÄ±r escort`,
    `${ilce} Ã§Ä±tÄ±r eskort`
  ];

  // Render 4 models dynamically using the original site profiles to match the user's request
  let modelsMd = '';
  for (let i = 0; i < 4; i++) {
    const profile = ORIGINAL_VITRIN[i];
    const imageUrl = `https://${HOST}/_media/vitrin/${profile.img}`;
    const profileUrl = `https://${HOST}/go/${slugify(profile.name)}`;
    
    // Distribute keywords into alt tags to prevent MDX 500 crashes
    const startIdx = i * 9;
    const endIdx = startIdx + 9;
    const modelKws = goldKeywords.slice(startIdx, endIdx).join(', ');
    const altText = `${profile.name} - ${ilce} Escort Bayan | ${profile.race} Eskort | ${modelKws}`;
    const imageMarkdown = `![${altText}](${imageUrl})`;

    // Spun properties per model to prevent duplication penalties
    const mQual = getRandomElement(ADULT_QUALITIES);
    const mNiche = getRandomElement(ADULT_NICHES);

    modelsMd += `
### ğŸ” ${profile.name} - ${ilce} Escort Bayan | ${profile.race} Eskort
${imageMarkdown}

*   **Kategori:** ${profile.cat}
*   **Ã–zellik:** ${mQual}
*   **Hizmet Konsepti:** ${mNiche}
*   **Profil DetayÄ±:** **[${ilce} Escort Randevusu Al](${profileUrl})**

---
`;
  }

  // Insert Google Site Verification metadata into Markdown Frontmatter
  const frontmatter = `---
title: ${title}
meta:
  - name: google-site-verification
    content: ${verificationCode.replace('.html', '')}
---
`;

  return `${frontmatter}
# ${title}

${p1}

${modelsMd}

${p2}

[ğŸ” ${sehir} Escort KataloÄŸunu GÃ¶rÃ¼ntÃ¼le](https://${HOST}/${slugify(sehir)})
`;
}

function generateLandingPageContent(verificationCode: string): string {
  const title = `Ä°stanbul Escort & Istanbul Escort Bayan Ä°lanlarÄ± | Elit ve VIP Randevu Rehberi`;
  
  const frontmatter = `---
title: ${title}
meta:
  - name: google-site-verification
    content: ${verificationCode.replace('.html', '')}
---
`;

  const intro = `## ğŸ”¥ Ä°stanbul'un En SeÃ§kin Elit ve VIP Escort Bayan Rehberine HoÅŸ Geldiniz

Ä°stanbulâ€™un hareketli yaÅŸamÄ±nda kendinize Ã¶zel, prestijli ve tutku dolu bir mola vermek istediÄŸinizde ajansÄ±mÄ±z size en elit partnerleri sunar. Tamamen gizlilik esasÄ±na dayalÄ±, profesyonel hizmet anlayÄ±ÅŸÄ±mÄ±zla hayallerinizdeki buluÅŸmayÄ± gerÃ§eÄŸe dÃ¶nÃ¼ÅŸtÃ¼rÃ¼yoruz.

> [!NOTE]
> Bu portal, **Ä°stanbul Escort** (Turkish) ve **Istanbul Escort** (English) hizmetleri iÃ§in doÄŸrulanmÄ±ÅŸ, gerÃ§ek ve kaporasÄ±z ilanlarÄ±n listelendiÄŸi resmi vitrin rehberidir.

---

## ğŸŒŸ HaftanÄ±n Ã–ne Ã‡Ä±kan VIP Ä°lanlarÄ± / Featured VIP Models
`;

  // Render 4 original profiles matching the core vitrins
  let p: string[] = [];
  const featuredQualities = ['CanlÄ± Teyit', 'GerÃ§ek FotoÄŸraflÄ±', 'Videolu Onay', 'KaporasÄ±z'];

  for (let i = 0; i < 4; i++) {
    const profile = ORIGINAL_VITRIN[i];
    const profileUrl = `https://${HOST}/go/${slugify(profile.name)}`;
    const imageUrl = `https://${HOST}/_media/vitrin/${profile.img}`;
    const imageMarkdown = `![${profile.name}](${imageUrl})`;

    p.push(`**${profile.name}** (${profile.race})<br>${imageMarkdown}<br>_${profile.cat}_<br>**[${featuredQualities[i]}](${profileUrl})**`);
  }

  const tableGrid = `
| **ğŸ”¥ VIP MODEL** | **ğŸ‘‘ PREMIUM PARTNER** | **âœ¨ ELÄ°T EÅLÄ°K** | **ğŸ’ VIP SEÃ‡ENEK** |
| :---: | :---: | :---: | :---: |
| ${p[0]} | ${p[1]} | ${p[2]} | ${p[3]} |
`;

  const sections = `
---

## ğŸ›¡ï¸ Neden Bizi Tercih Etmelisiniz?

1. **DoÄŸrulanmÄ±ÅŸ ve GerÃ§ek GÃ¶rseller:** Sitemizdeki tÃ¼m profiller gÃ¼ncel fotoÄŸraflarla doÄŸrulanmÄ±ÅŸtÄ±r. FotoÄŸrafta ne gÃ¶rÃ¼yorsanÄ±z, kapÄ±da o karÅŸÄ±lar.
2. **KaporasÄ±z GÃ¼venli Randevu:** Ã–n Ã¶deme veya kapora tuzaÄŸÄ± olmadan, karÅŸÄ±lÄ±klÄ± gÃ¼ven esasÄ±na dayalÄ± elit buluÅŸma.
3. **Maksimum Hijyen ve Gizlilik:** SÄ±nÄ±rlarÄ± sizin belirleyeceÄŸiniz, hijyenik ve %100 gizli ortamlarda kusursuz VIP escort deneyimi.

> [!TIP]
> **GÃ¼venli BuluÅŸma KuralÄ±:** Kapora isteyen ÅŸahÄ±slara itibar etmeyiniz. Platformumuzdaki tÃ¼m **Ä°stanbul Escort** bayanlar kapÄ±da Ã¶deme esasÄ±yla Ã§alÄ±ÅŸmaktadÄ±r.

---

## ğŸ—ºï¸ Ä°stanbul PopÃ¼ler Escort BÃ¶lgeleri

AÅŸaÄŸÄ±daki popÃ¼ler bÃ¶lgelerimizden birini sol menÃ¼den seÃ§erek veya doÄŸrudan arayarak o bÃ¶lgedeki en sÄ±cak ilan vitrinlerine eriÅŸebilirsiniz:

* **[ÅiÅŸli Escort](https://istanbulescort.blog/istanbul/sisli):** Åehrin kalbinde, lÃ¼ks rezidanslarda benzersiz deneyimler.
* **[BeÅŸiktaÅŸ Escort](https://istanbulescort.blog/istanbul/besiktas):** BoÄŸaz esintisi eÅŸliÄŸinde elit ve kÃ¼ltÃ¼rlÃ¼ partnerler.
* **[KadÄ±kÃ¶y Escort](https://istanbulescort.blog/istanbul/kadikoy):** Anadolu YakasÄ±'nÄ±n en popÃ¼ler, sÄ±cak ve samimi kaÃ§amaklarÄ±.
* **[BeylikdÃ¼zÃ¼ Escort](https://istanbulescort.blog/istanbul/beylikduzu):** Modern, lÃ¼ks ve konforlu dairelerde tamamen size Ã¶zel saatler.
* **[AtaÅŸehir Escort](https://istanbulescort.blog/istanbul/atasehir):** Finans merkezinin kalbinde prestijli VIP partner eÅŸlik hizmeti.

---

## ğŸ’¬ SÄ±kÃ§a Sorulan Sorular (FAQ)

**S: NasÄ±l randevu alabilirim?**
> C: Sol menÃ¼den ilÃ§enizi seÃ§in, beÄŸendiÄŸiniz modelin profilindeki yÃ¶nlendirme linkine tÄ±klayarak doÄŸrudan gerÃ§ek numaralarÄ±na veya Telegram/WhatsApp kanallarÄ±na baÄŸlanÄ±n.

**S: GÃ¶rseller gÃ¼ncel ve gerÃ§ek mi?**
> C: Evet, listelenen tÃ¼m gÃ¶rseller stÃ¼dyo ve canlÄ± teyit onayÄ±ndan geÃ§miÅŸ aktif Ã¼yelere aittir.

**S: BuluÅŸma lokasyonlarÄ± nerelerdir?**
> C: Modellerin kendi Ã¶zel daireleri/rezidanslarÄ± bulunmakla birlikte, lÃ¼ks otel veya kendi adresinize servis seÃ§enekleri de mevcuttur.

---

[ğŸ” TÃœM AKTÄ°F ELÄ°T PROFÄ°LLERÄ° GÃ–RMEK Ä°Ã‡Ä°N TIKLAYIN! (Official Website)](https://${HOST})
`;

  return `${frontmatter}
# ${title}

${intro}
${tableGrid}
${sections}
`;
}

interface TocItem {
  type: "item" | "group";
  title: string;
  uri?: string;
  items?: TocItem[];
}

export async function buildYeni1Project() {
  const folderName = 'yeni1';
  const folderPath = path.join(DESKTOP_PATH, folderName);
  
  console.log(`ğŸ”¨ Building 'yeni1' Markdown Stoplight project for Istanbul at: ${folderPath}`);
  
  const docsDir = path.join(folderPath, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });

  // Generate and Write Welcome/Landing page (README.md) inside docs/ and root
  const landingPageContent = generateLandingPageContent(GSC_FILES[0].name);
  fs.writeFileSync(path.join(folderPath, 'README.md'), landingPageContent);
  fs.writeFileSync(path.join(docsDir, 'README.md'), landingPageContent);

  // Write HTML Verification Files (both files on root & docs for maximum compatibility)
  for (const f of GSC_FILES) {
    fs.writeFileSync(path.join(folderPath, f.name), f.content);
    fs.writeFileSync(path.join(docsDir, f.name), f.content);
  }

  // robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://escort-randevu.stoplight.io/sitemap.xml
`;
  fs.writeFileSync(path.join(folderPath, 'robots.txt'), robotsTxt);

  // Initialize TOC list
  const tocItems: TocItem[] = [
    {
      "type": "item",
      "title": "GiriÅŸ ve Rehber",
      "uri": "/docs/README.md"
    }
  ];

  let pathCounter = 0;
  const processedDistricts = new Set<string>();
  const sitemapUrls: string[] = [
    'https://escort-randevu.stoplight.io/',
    'https://escort-randevu.stoplight.io/docs/README'
  ];

  for (const district of istanbulCity.districts) {
    const cleanDistrictName = district.name.replace(/\s+escort/gi, '').trim();
    const districtSlug = slugify(cleanDistrictName);

    // Skip duplicates
    if (processedDistricts.has(districtSlug)) continue;
    processedDistricts.add(districtSlug);

    const districtGroupItems: TocItem[] = [];
    const distVCode = GSC_FILES[pathCounter % GSC_FILES.length].name;

    // 1. Generate District-level Markdown Page (Using -escort in slug/filename)
    const districtFileName = `istanbul-${districtSlug}-escort.md`;
    const districtFileContent = generateMarkdownPageContent("Ä°stanbul", cleanDistrictName, pathCounter, distVCode);
    fs.writeFileSync(path.join(docsDir, districtFileName), districtFileContent);

    districtGroupItems.push({
      "type": "item",
      "title": `${cleanDistrictName} Genel Ä°lanlarÄ±`,
      "uri": `/docs/${districtFileName}`
    });
    sitemapUrls.push(`https://escort-randevu.stoplight.io/docs/istanbul-${districtSlug}-escort`);
    pathCounter++;

    // 2. Generate Neighborhood-level Markdown Pages (Using -escort in slug/filename)
    const processedNeighborhoods = new Set<string>();
    for (const neighborhood of district.neighborhoods) {
      const neighborhoodSlug = slugify(neighborhood.name);

      if (processedNeighborhoods.has(neighborhoodSlug)) continue;
      processedNeighborhoods.add(neighborhoodSlug);

      const neighborhoodFileName = `istanbul-${districtSlug}-${neighborhoodSlug}-escort.md`;
      const searchTarget = `${cleanDistrictName} ${neighborhood.name}`;
      const nVCode = GSC_FILES[pathCounter % GSC_FILES.length].name;
      const neighborhoodFileContent = generateMarkdownPageContent("Ä°stanbul", searchTarget, pathCounter, nVCode);
      
      fs.writeFileSync(path.join(docsDir, neighborhoodFileName), neighborhoodFileContent);

      districtGroupItems.push({
        "type": "item",
        "title": `${neighborhood.name} Escort`,
        "uri": `/docs/${neighborhoodFileName}`
      });
      sitemapUrls.push(`https://escort-randevu.stoplight.io/docs/istanbul-${districtSlug}-${neighborhoodSlug}-escort`);
      pathCounter++;
    }

    // Add district group to TOC
    tocItems.push({
      "type": "group",
      "title": `${cleanDistrictName} Escort Ä°lanlarÄ±`,
      "items": districtGroupItems
    });
  }

  // Write toc.json
  const toc = {
    "items": tocItems
  };
  fs.writeFileSync(path.join(folderPath, 'toc.json'), JSON.stringify(toc, null, 2));

  // Write sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(folderPath, 'sitemap.xml'), sitemapXml);

  console.log(`âœ¨ Generated ${pathCounter} Markdown files in docs/ folder.`);
  console.log(`âœ¨ Generated sitemap.xml with ${sitemapUrls.length} entries.`);

  // Compress to ZIP
  console.log("ğŸ“¦ Packaging 'yeni1' Markdown project...");
  const zipPath = path.join(DESKTOP_PATH, 'yeni1.zip');
  
  try {
    execSync(`powershell -Command "Compress-Archive -Path '${folderPath}\\*' -DestinationPath '${zipPath}' -Force"`);
    console.log(`âœ… Project successfully compiled at: ${zipPath}`);
    
    // Clean temp files
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log("ğŸ—‘ï¸ Temporary files cleaned.");
  } catch (err) {
    console.error("Error packaging yeni1 project:", err);
  }
}

if (require.main === module) {
  buildYeni1Project().catch(console.error);
}

