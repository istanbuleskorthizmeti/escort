import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { istanbulCity } from '../lib/locations-registry/istanbul';

/**
 * 🔞 BLACK HAT SEO OMNI-GENERATOR - "yeni1" (Markdown Istanbul Edition)
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
  "Anal Fantezi", "Dominatrix", "Sınırsız Escort", "Kaporasız Escort", "Evli Escort", "Dul Escort", "Üniversiteli Escort",
  "Manken Escort", "Model Escort", "Boutique Escort", "Slav Escort", "Sarışın Escort", "Esmer Escort"
];

const ADULT_NICHES = [
  "Outdoor", "Office", "Gym", "Hotel", "Massage", "Spa", "Beach", "Public", "Party", "Club", "Luxury", "Elite", "VIP",
  "Lüks", "Gizli", "Kaçamak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "Kaporasız", "Güvenilir"
];

const ADULT_PROFILE_ADJECTIVES = [
  "Ateşli", "Sıcak", "Nefes Kesen", "Baştan Çıkarıcı", "Vahşi", "Doyumsuz", "Kışkırtıcı", "Egzotik",
  "Tanrıça", "Afet", "Bomba", "Pırlanta", "Elite", "VIP"
];

const ADULT_QUALITIES = [
  "4K Ultra HD", "1080p Full HD", "Sansürsüz", "Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız"
];

// Original Top 4 Profiles from original site
const ORIGINAL_VITRIN = [
  { name: 'Melissa', img: 'istanbul-kaporasiz-escort-melissa-1.webp', race: 'Turkish', cat: 'Elite VIP Partner', phone: '905330892496' },
  { name: 'Aynur', img: 'istanbul-kaporasiz-escort-aynur-1.webp', race: 'Turkish', cat: 'VIP Sarışın Model', phone: '905016355053' },
  { name: 'Svetlana', img: 'istanbul-kaporasiz-escort-svetlana-1.webp', race: 'Russian', cat: 'Elit Rus Model', phone: '447426976466' },
  { name: 'Ceren', img: 'istanbul-kaporasiz-escort-ceren-1.webp', race: 'Turkish', cat: 'VIP Elit Model', phone: '905368396114' }
];

// Anti-Duplicate content spin templates
const P1_TEMPLATES = [
  "**{sehir} {ilce}** bölgesinde en sıcak {adj} ve {luks} **İstanbul Escort** veya **Istanbul Escort** hizmeti arayan beyler için doğrulanmış reklam görsellerini listeledik. Bu sayfadaki profiller, {sehir} genelinde {hizmet} sunan bağımsız partnerlerdir.",
  "Günlük hayatın temposuna konforlu bir mola verip kendinize özel anlar yaratmak istiyorsanız, **{sehir} {ilce}** {ilan} tam size göre. Beklentileriniz doğrultusunda, {luks} ve unutulmaz anlar için en iyi **İstanbul Escort** / **Istanbul Escort** seçeneklerini inceleyebilirsiniz.",
  "**{sehir} {ilce}** bölgesinde en çok tercih edilen bağımsız {secenek} listesiyle karşınızdayız. Size en üst düzeyde kalite, {luks} ve gizlilik vaat eden seçkin **İstanbul Escort** (Turkish) ve **Istanbul Escort** (English) profillerinin tüm detaylarını burada bulacaksınız.",
  "Seçkin ve elit partner arayışınızı taçlandırmak için **{sehir} {ilce}** bölgesinin en güncel {secenek} ilanlarını tek bir çatı altında topladık. Tamamen {luks} standartlarda hizmet sunan ve yüksek memnuniyet garantisi veren **İstanbul Escort** partnerleriyle hemen iletişime geçebilirsiniz."
];

const P2_TEMPLATES = [
  "Görüşmeler tamamen {niche} konseptinde, kaporasız buluşma garantisiyle gerçekleştirilir. Yüksek kaliteli ve {luks} bir eşlik deneyimi yaşamak için görseller altındaki profilleri inceleyebilirsiniz. En iyi **İstanbul Escort** / **Istanbul Escort** deneyimi için 7/24 kesintisiz hizmet sunulmaktadır.",
  "Rezervasyon ve buluşma süreçlerinde güvenlik ile gizlilik en hassas kuralımızdır. Bu bölgedeki bağımsız VIP profiller, {niche} ortamlarda randevu kabul etmekte ve kapora talep etmemektedir. Güvenilir bir **İstanbul Escort** randevusu oluşturmak için profil kartlarındaki yönlendirme bağlantılarını kullanabilirsiniz.",
  "Doğrulanmış ilanlar ve gerçek fotoğraflarla desteklenen vitrinimiz, arama motorlarında kopya içerik üretilmesini engelleyen özgün algoritmalarla korunmaktadır. Size en yakın **{sehir} {ilce} escort** profilini seçerek, kaporasız ve elden ödeme güvencesiyle unutulmaz bir deneyime adım atın.",
  "Ajansımız, en seçkin **{sehir} {ilce} eskort** listesini sunarken karşılıkli güveni esas alır. Ön ödeme veya kapora gibi riskli taleplerle karşılaşmayacağınız, tamamen doğrulanmış ve VIP standartlardaki **İstanbul Escort** profilleriyle keyifli anların tadını çıkarın."
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
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
    .replace(/{secenek}/g, () => getRandomElement(['escort bayan', 'VIP refakatçi', 'bireysel partner']))
    .replace(/{hizmet}/g, () => getRandomElement(['VIP escort hizmeti', 'doğrulanmış eskort rehberi', 'bireysel refakat']))
    .replace(/{ilan}/g, () => getRandomElement(['kaporasız escort ilanları', 'bireysel escort bayan vitrini', 'VIP eskort seçenekleri']))
    .replace(/{luks}/g, () => getRandomElement(['lüks', 'elit', 'ayrıcalıklı', 'gerçek fotoğraflı']))
    .replace(/{([^{}]+)}/g, (_, choices) => {
      const arr = choices.split('|');
      return getRandomElement(arr);
    });
}

function generateMarkdownPageContent(sehir: string, ilce: string, pathCounter: number): string {
  const race = getRandomElement(ADULT_RACES);
  const category = getRandomElement(ADULT_CATEGORIES);
  const niche = getRandomElement(ADULT_NICHES);
  const adj = getRandomElement(ADULT_PROFILE_ADJECTIVES);
  const quality = getRandomElement(ADULT_QUALITIES);

  const context = { race, category, niche, adj, quality };
  
  // Title featuring specific district/neighborhood with both escort and eskort
  const title = `${ilce} Escort | ${ilce} Eskort Bayan İlanları`;

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
    `kaporasız ${ilce} escort`,
    `kaporasız ${ilce} eskort`,
    `${ilce} escort bayan ilanları`,
    `${ilce} eskort bayan ilanları`,
    `${ilce} VIP escort`,
    `${ilce} VIP eskort`,
    `${ilce} eve gelen escort`,
    `${ilce} eve gelen eskort`,
    `${ilce} otelde randevu escort`,
    `${ilce} otelde randevu eskort`,
    `${ilce} escort telefonları`,
    `${ilce} eskort telefonları`,
    `${ilce} escort numaraları`,
    `${ilce} eskort numaraları`,
    `${ilce} en yakın escort`,
    `${ilce} en yakın eskort`,
    `${ilce} ucuz escort`,
    `${ilce} ucuz eskort`,
    `${ilce} sınırsız escort`,
    `${ilce} sınırsız eskort`,
    `${ilce} yabancı escort`,
    `${ilce} yabancı eskort`,
    `${ilce} rus escort`,
    `${ilce} rus eskort`,
    `${ilce} anal escort`,
    `${ilce} anal eskort`,
    `${ilce} çıtır escort`,
    `${ilce} çıtır eskort`
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
### 🔞 ${profile.name} - ${ilce} Escort Bayan | ${profile.race} Eskort
${imageMarkdown}

*   **Kategori:** ${profile.cat}
*   **Özellik:** ${mQual}
*   **Hizmet Konsepti:** ${mNiche}
*   **Profil Detayı:** **[${ilce} Escort Randevusu Al](${profileUrl})**

---
`;
  }

  // Insert Google Site Verification metadata into Markdown Frontmatter
  const frontmatter = `---
title: ${title}
meta:
  - name: google-site-verification
    content: qccx44g5S-nkLQjyo5uIjlGz_STmjbpZ6p5mRdZT50U
---
`;

  return `${frontmatter}
# ${title}

${p1}

${modelsMd}

${p2}

[🔞 ${sehir} Escort Kataloğunu Görüntüle](https://${HOST}/${slugify(sehir)})
`;
}

function generateLandingPageContent(): string {
  const title = `İstanbul Escort & Istanbul Escort Bayan İlanları | Elit ve VIP Randevu Rehberi`;
  
  const frontmatter = `---
title: ${title}
meta:
  - name: google-site-verification
    content: qccx44g5S-nkLQjyo5uIjlGz_STmjbpZ6p5mRdZT50U
---
`;

  const intro = `## 🔥 İstanbul'un En Seçkin Elit ve VIP Escort Bayan Rehberine Hoş Geldiniz

İstanbul’un hareketli yaşamında kendinize özel, prestijli ve tutku dolu bir mola vermek istediğinizde ajansımız size en elit partnerleri sunar. Tamamen gizlilik esasına dayalı, profesyonel hizmet anlayışımızla hayallerinizdeki buluşmayı gerçeğe dönüştürüyoruz.

> [!NOTE]
> Bu portal, **İstanbul Escort** (Turkish) ve **Istanbul Escort** (English) hizmetleri için doğrulanmış, gerçek ve kaporasız ilanların listelendiği resmi vitrin rehberidir.

---

## 🌟 Haftanın Öne Çıkan VIP İlanları / Featured VIP Models
`;

  // Render 4 original profiles matching the core vitrins
  let p: string[] = [];
  const featuredQualities = ['Canlı Teyit', 'Gerçek Fotoğraflı', 'Videolu Onay', 'Kaporasız'];

  for (let i = 0; i < 4; i++) {
    const profile = ORIGINAL_VITRIN[i];
    const profileUrl = `https://${HOST}/go/${slugify(profile.name)}`;
    const imageUrl = `https://${HOST}/_media/vitrin/${profile.img}`;
    const imageMarkdown = `![${profile.name}](${imageUrl})`;

    p.push(`**${profile.name}** (${profile.race})<br>${imageMarkdown}<br>_${profile.cat}_<br>**[${featuredQualities[i]}](${profileUrl})**`);
  }

  const tableGrid = `
| **🔥 VIP MODEL** | **👑 PREMIUM PARTNER** | **✨ ELİT EŞLİK** | **💎 VIP SEÇENEK** |
| :---: | :---: | :---: | :---: |
| ${p[0]} | ${p[1]} | ${p[2]} | ${p[3]} |
`;

  const sections = `
---

## 🛡️ Neden Bizi Tercih Etmelisiniz?

1. **Doğrulanmış ve Gerçek Görseller:** Sitemizdeki tüm profiller güncel fotoğraflarla doğrulanmıştır. Fotoğrafta ne görüyorsanız, kapıda o karşılar.
2. **Kaporasız Güvenli Randevu:** Ön ödeme veya kapora tuzağı olmadan, karşılıklı güven esasına dayalı elit buluşma.
3. **Maksimum Hijyen ve Gizlilik:** Sınırları sizin belirleyeceğiniz, hijyenik ve %100 gizli ortamlarda kusursuz VIP escort deneyimi.

> [!TIP]
> **Güvenli Buluşma Kuralı:** Kapora isteyen şahıslara itibar etmeyiniz. Platformumuzdaki tüm **İstanbul Escort** bayanlar kapıda ödeme esasıyla çalışmaktadır.

---

## 🗺️ İstanbul Popüler Escort Bölgeleri

Aşağıdaki popüler bölgelerimizden birini sol menüden seçerek veya doğrudan arayarak o bölgedeki en sıcak ilan vitrinlerine erişebilirsiniz:

* **[Şişli Escort](https://istanbulescort.blog/istanbul/sisli):** Şehrin kalbinde, lüks rezidanslarda benzersiz deneyimler.
* **[Beşiktaş Escort](https://istanbulescort.blog/istanbul/besiktas):** Boğaz esintisi eşliğinde elit ve kültürlü partnerler.
* **[Kadıköy Escort](https://istanbulescort.blog/istanbul/kadikoy):** Anadolu Yakası'nın en popüler, sıcak ve samimi kaçamakları.
* **[Beylikdüzü Escort](https://istanbulescort.blog/istanbul/beylikduzu):** Modern, lüks ve konforlu dairelerde tamamen size özel saatler.
* **[Ataşehir Escort](https://istanbulescort.blog/istanbul/atasehir):** Finans merkezinin kalbinde prestijli VIP partner eşlik hizmeti.

---

## 💬 Sıkça Sorulan Sorular (FAQ)

**S: Nasıl randevu alabilirim?**
> C: Sol menüden ilçenizi seçin, beğendiğiniz modelin profilindeki yönlendirme linkine tıklayarak doğrudan gerçek numaralarına veya Telegram/WhatsApp kanallarına bağlanın.

**S: Görseller güncel ve gerçek mi?**
> C: Evet, listelenen tüm görseller stüdyo ve canlı teyit onayından geçmiş aktif üyelere aittir.

**S: Buluşma lokasyonları nerelerdir?**
> C: Modellerin kendi özel daireleri/rezidansları bulunmakla birlikte, lüks otel veya kendi adresinize servis seçenekleri de mevcuttur.

---

[🔞 TÜM AKTİF ELİT PROFİLLERİ GÖRMEK İÇİN TIKLAYIN! (Official Website)](https://${HOST})
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
  
  console.log(`🔨 Building 'yeni1' Markdown Stoplight project for Istanbul at: ${folderPath}`);
  
  const docsDir = path.join(folderPath, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });

  // Generate and Write Welcome/Landing page (README.md) inside docs/ and root
  const landingPageContent = generateLandingPageContent();
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
      "title": "Giriş ve Rehber",
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

    // 1. Generate District-level Markdown Page (Using -escort in slug/filename)
    const districtFileName = `istanbul-${districtSlug}-escort.md`;
    const districtFileContent = generateMarkdownPageContent("İstanbul", cleanDistrictName, pathCounter);
    fs.writeFileSync(path.join(docsDir, districtFileName), districtFileContent);

    districtGroupItems.push({
      "type": "item",
      "title": `${cleanDistrictName} Genel İlanları`,
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
      const neighborhoodFileContent = generateMarkdownPageContent("İstanbul", searchTarget, pathCounter);
      
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
      "title": `${cleanDistrictName} Escort İlanları`,
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

  console.log(`✨ Generated ${pathCounter} Markdown files in docs/ folder.`);
  console.log(`✨ Generated sitemap.xml with ${sitemapUrls.length} entries.`);

  // Compress to ZIP
  console.log("📦 Packaging 'yeni1' Markdown project...");
  const zipPath = path.join(DESKTOP_PATH, 'yeni1.zip');
  
  try {
    execSync(`powershell -Command "Compress-Archive -Path '${folderPath}\\*' -DestinationPath '${zipPath}' -Force"`);
    console.log(`✅ Project successfully compiled at: ${zipPath}`);
    
    // Clean temp files
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log("🗑️ Temporary files cleaned.");
  } catch (err) {
    console.error("Error packaging yeni1 project:", err);
  }
}

if (require.main === module) {
  buildYeni1Project().catch(console.error);
}
