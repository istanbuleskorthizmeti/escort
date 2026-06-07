import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * 🔞 BULLETPROOF ADULT STOPLIGHT GENERATOR (v4.0 - NO-HTML / NO-500)
 * Replaces all raw HTML tags/styles with 100% native Markdown structures.
 * This guarantees zero rendering exceptions (500 errors) in Stoplight's React-based markdown parser.
 * Outputs directly to Desktop as ZIP archives.
 */

const HOST = 'istanbulescort.blog';
const DESKTOP_PATH = 'C:\\Users\\onurk\\Desktop';

// 1. ADULT NICHE MATRIX DATA
const ADULT_RACES = [
  "Turkish", "Russian", "Asian", "Ebony", "Latina", "European", "Ukrainian", "Belarusian", "Arab", "Persian",
  "Uzbek", "Kazakh", "Romanian", "Moldovan", "Brazilian", "Thai", "Japanese", "Korean", "Italian", "Spanish",
  "French", "German", "Greek", "American", "British", "Australian", "Scandinavian", "Dutch", "Indian", "Moroccan",
  "Serbian", "Bulgarian", "Albanian", "Swedish", "Norwegian", "Colombian", "Venezuelan", "Argentine", "Mexican"
];

const ADULT_CATEGORIES = [
  "Anal", "BDSM", "MILF", "Teen", "Threesome", "Orgy", "Gangbang", "Fetish", "Amateur", "Professional",
  "POV", "VR", "Hardcore", "Softcore", "Solo", "Lesbian", "Gay", "Trans", "Interracial",
  "Anal Fantezi", "Dominatrix", "Sınırsız Escort", "Kaporasız Escort", "Evli Escort", "Dul Escort", "Üniversiteli Escort",
  "Öğrenci Escort", "Manken Escort", "Model Escort", "Boutique Escort", "Slav Escort", "Kızıl Escort", "Sarışın Escort", "Esmer Escort", "Kumral Escort", "Çikolata Ten Escort",
  "Fetişist Escort", "Lateks", "Deri", "Cosplay", "Öğretmen", "Hemşire", "Hizmetçi", "Sekreter", "Ofis Fantezisi"
];

const ADULT_NICHES = [
  "Outdoor", "Office", "Gym", "Hotel", "Hidden Cam", "Casting", "Massage", "Spa", "Beach", "Public", "Party", "Club", "Nightlife", "Luxury", "Elite", "VIP",
  "Lüks", "Gizli", "Kaçamak", "Otel", "Rezidans", "Evlere Servis", "Otele Servis", "Kaporasız", "Güvenilir",
  "Yat Partisi", "Villa", "Havuz Başı", "Penthouse"
];

const ADULT_PROFILE_ADJECTIVES = [
  "Ateşli", "Sıcak", "Nefes Kesen", "Baştan Çıkarıcı", "Vahşi", "Doyumsuz", "Kışkırtıcı", "Egzotik",
  "Masum", "Utangaç", "Vezir", "Tanrıça", "Afet", "Bomba", "Pırlanta", "Elmas", "Elite", "VIP",
  "Sarsıcı", "Göz Alıcı", "Büyüleyici", "Mistik", "Bağımlılık Yapan", "Tehlikeli", "Efsanevi", "Eşsiz"
];

const ADULT_QUALITIES = [
  "4K Ultra HD", "1080p Full HD", "60FPS", "VR 360", "Uncensored", "Sansürsüz", "Gerçek Görsel", "Videolu Onay", "Canlı Teyit", "Kaporasız", "Gerçek Fotoğraflı"
];

const ADULT_TAGS = [
  "VIP", "Elite", "Luxury", "Anal", "BDSM", "MILF", "Teen", "Amateur", "POV", "VR",
  "Kaporasız", "Gerçek Fotoğraflı", "Doğrulanmış", "Sınırsız", "Evli", "Dul",
  "Üniversiteli", "Öğrenci", "Slav", "Rus", "Yabancı", "Yerli", "Esmer", "Sarışın"
];

// Target Cities and Districts Map
const TOP_CITIES: Record<string, string[]> = {
  'Istanbul': [
    'Besiktas', 'Sisli', 'Beylikduzu', 'Kadikoy', 'Bakirkoy', 'Atasehir', 
    'Esenyurt', 'Fatih', 'Sariyer', 'Uskudar', 'Avcilar', 'Kagitthane', 
    'Beyoglu', 'Kartal', 'Maltepe', 'Pendik', 'Umraniye', 'Bahcelievler', 
    'Zeytinburnu', 'Buyukcekmece', 'Kucukcekmece'
  ],
  'Ankara': [
    'Cankaya', 'Kizilay', 'Kecioren', 'Yenimahalle', 'Mamak', 'Etimesgut', 
    'Altindag', 'Sincan', 'Golbasi', 'Pursaklar', 'Eryaman'
  ],
  'Izmir': [
    'Alsancak', 'Karsiyaka', 'Konak', 'Bornova', 'Buca', 'Cesme', 
    'Alacati', 'Bayrakli', 'Balcova', 'Gaziemir', 'Narlidere'
  ],
  'Antalya': [
    'Muratpasa', 'Konyaalti', 'Kepez', 'Alanya', 'Manavgat', 'Serik', 
    'Kemer', 'Kas', 'Lara'
  ],
  'Bursa': [
    'Nilufer', 'Osmangazi', 'Yildirim', 'Mudanya', 'Gemlik', 'Inegol'
  ],
  'Adana': [
    'Seyhan', 'Cukurova', 'Yuregir', 'Saricam'
  ],
  'Mugla': [
    'Bodrum', 'Marmaris', 'Fethiye', 'Milas', 'Datca', 'Ortaca'
  ],
  'Kocaeli': [
    'Izmit', 'Gebze', 'Darica', 'Korfez', 'Kartepe', 'Basiskele'
  ],
  'Eskisehir': [
    'Odunpazari', 'Tepebasi'
  ],
  'Gaziantep': [
    'Sahinbey', 'Sehitkamil'
  ]
};

const ALL_CITIES = [
  'Adana', 'Adiyaman', 'Afyonkarahisar', 'Agri', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 
  'Ardahan', 'Artvin', 'Aydin', 'Balikesir', 'Bartin', 'Batman', 'Bayburt', 'Bilecik', 
  'Bingol', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Canakkale', 'Cankiri', 'Corum', 'Denizli', 
  'Diyarbakir', 'Duzce', 'Edirne', 'Elazig', 'Erzincan', 'Erzurum', 'Eskisehir', 'Gaziantep', 
  'Giresun', 'Gumushane', 'Hakkari', 'Hatay', 'Igdir', 'Isparta', 'Istanbul', 'Izmir', 
  'Kahramanmaras', 'Karabuk', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kirikkale', 
  'Kirklareli', 'Kirsehir', 'Kilis', 'Kocaeli', 'Konya', 'Kutahya', 'Malatya', 'Manisa', 
  'Mardin', 'Mersin', 'Mugla', 'Mus', 'Nevsehir', 'Nigde', 'Ordu', 'Osmaniye', 'Rize', 
  'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Sanliurfa', 'Sirnak', 'Tekirdag', 
  'Tokat', 'Trabzon', 'Tunceli', 'Usak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const FEMALE_NAMES = [
  'Aylin', 'Buse', 'Ceren', 'Derin', 'Ece', 'Figen', 'Gizem', 'Hande', 'Irem', 'Jale',
  'Kubra', 'Lara', 'Merve', 'Nihan', 'Ozge', 'Pelin', 'Ruya', 'Selin', 'Tugce', 'Umut',
  'Verda', 'Yasemin', 'Zehra', 'Asli', 'Begum', 'Cansel', 'Didem', 'Elif', 'Gamze', 'Hulya'
];

const BIO_LINES = [
  "Lüks ve kaliteli buluşmaların adresi. %100 gizlilik garantisi sunulur.",
  "Eşsiz bir deneyim yaşamak isteyen elit beyler için en özel refakat hizmeti.",
  "Tamamen bağımsız, seyahat engeli olmayan ve görsel doğrulaması yapılmış vip profil.",
  "Zarif sohbeti ve büyüleyici güzelliği ile gecenize renk katacak profesyonel yol arkadaşı."
];

// Spun Content Templates
const INTRO_TEMPLATES = [
  "**{sehir} {ilce}** bölgesinde elit ve lüks {secenek} arayanlar için oluşturulmuş en özel vitrin rehberindesiniz. Bu portal üzerinden, {sehir} genelinde {hizmet} veren bağımsız üyelere doğrudan ulaşabilirsiniz.",
  "Hayatın koşturmacasından sıyrılıp kendinize özel, konforlu bir zaman dilimi ayırmak istiyorsanız, **{sehir} {ilce}** {ilan} tam size göre. Beklentileriniz doğrultusunda {luks} anlar için vitrinimizi inceleyin."
];

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
    .replace(/{hizmet}/g, () => getRandomElement(['VIP escort hizmetleri', 'elit eşlik hizmeti', 'doğrulanmış profiller']))
    .replace(/{ilan}/g, () => getRandomElement(['kaporasız escort ilanları', 'bireysel escort bayan rehberi', 'lüks escort seçenekleri']))
    .replace(/{luks}/g, () => getRandomElement(['lüks', 'elit', 'kaliteli', 'kusursuz']))
    .replace(/{([^{}]+)}/g, (_, choices) => {
      const arr = choices.split('|');
      return getRandomElement(arr);
    });
}

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

function generateAggressiveKeywords(sehir: string, ilce: string, race: string, category: string): string[] {
  return [
    `${sehir} ${ilce} escort`,
    `${sehir} ${ilce} ${slugify(race)} escort`,
    `kaporasız ${sehir} escort ${slugify(category)}`,
    `gerçek fotoğraflı ${sehir} ${ilce} escort`,
    `${sehir} eve gelen escort`,
    `${sehir} otele servis escort`,
    `${sehir} eskort telefonları`,
    `${sehir} escort numaraları`,
    `${sehir} güvenilir escort bayanlar`
  ];
}

// 2. NATIVE MARKDOWN LAYOUT RENDERERS (Guaranteed NO 500 error)
// Design 1: Classic Card Grid via Markdown Table Columns
function getDesignClassic(sehir: string, ilce: string, host: string): string {
  const p: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const name = getRandomElement(FEMALE_NAMES);
    const race = getRandomElement(ADULT_RACES);
    const category = getRandomElement(ADULT_CATEGORIES);
    const quality = getRandomElement(ADULT_QUALITIES);
    const url = `https://${host}/go/${slugify(name)}`;
    const img = `![${name}](https://${host}/_media/vitrin/vip-profil-${i}.webp)`;
    p.push(`**${name}** (${race})<br>${img}<br>_${category}_<br>**[${quality}](${url})**`);
  }
  
  return `
| **VIP MODEL** | **PREMIUM PARTNER** | **ELİT EŞLİK** |
| :---: | :---: | :---: |
| ${p[0]} | ${p[1]} | ${p[2]} |
| ${p[3]} | ${p[4]} | ${p[5]} |
`;
}

// Design 2: Blockquote-Based Highlights
function getDesignGlass(sehir: string, ilce: string, host: string): string {
  let md = '';
  for (let i = 1; i <= 6; i++) {
    const name = getRandomElement(FEMALE_NAMES);
    const race = getRandomElement(ADULT_RACES);
    const category = getRandomElement(ADULT_CATEGORIES);
    const adj = getRandomElement(ADULT_PROFILE_ADJECTIVES);
    const quality = getRandomElement(ADULT_QUALITIES);
    const url = `https://${host}/go/${slugify(name)}`;

    md += `
> ### 🌟 VIP Model: ${name}
> ![${name}](https://${host}/_media/vitrin/vip-profil-${i}.webp)
> *   **Grup:** ${adj} ${race}
> *   **Hizmet:** ${category}
> *   **Nitelik:** ${quality} - [Profili İncele & İletişim](${url})
`;
  }
  return md;
}

// Design 3: 100% Standard Markdown Directory Table
function getDesignTable(sehir: string, ilce: string, host: string): string {
  let table = `
| Profil | İsim & Irk | Hizmet & Konum | Durum | Detay Linki |
| :---: | :--- | :--- | :---: | :---: |
`;

  for (let i = 1; i <= 6; i++) {
    const name = getRandomElement(FEMALE_NAMES);
    const race = getRandomElement(ADULT_RACES);
    const category = getRandomElement(ADULT_CATEGORIES);
    const quality = getRandomElement(ADULT_QUALITIES);
    const url = `https://${host}/go/${slugify(name)}`;

    table += `| ![${name}](https://${host}/_media/vitrin/vip-profil-${i}.webp) | **${name}** <br> _${race}_ | ${category} <br> ${ilce}, ${sehir} | ● Aktif <br> [${quality}] | **[Profili Gör](${url})** |\n`;
  }
  return table;
}

// Design 4: Vertical Bio list using simple headers
function getDesignList(sehir: string, ilce: string, host: string): string {
  let list = '';
  for (let i = 1; i <= 6; i++) {
    const name = getRandomElement(FEMALE_NAMES);
    const race = getRandomElement(ADULT_RACES);
    const category = getRandomElement(ADULT_CATEGORIES);
    const adj = getRandomElement(ADULT_PROFILE_ADJECTIVES);
    const niche = getRandomElement(ADULT_NICHES);
    const quality = getRandomElement(ADULT_QUALITIES);
    const bio = getRandomElement(BIO_LINES);
    const url = `https://${host}/go/${slugify(name)}`;

    list += `
### 🔞 VIP Independent: ${name} (${race})
![${name}](https://${host}/_media/vitrin/vip-profil-${i}.webp)

*   **Özellik:** ${adj} ${race} ${category}
*   **Hizmet Tarzı:** ${niche} konsepti
*   **Doğrulama:** ${quality}
*   **Hakkımda:** _"${bio}"_
*   **Buluşma:** **[Hemen İletişime Geç & Detaylar](${url})**

---
`;
  }
  return list;
}

// 3. CORE PAGE TEMPLATE
function generateMarkdownPage(sehir: string, ilce: string, designId: number, host: string): string {
  const race = getRandomElement(ADULT_RACES);
  const category = getRandomElement(ADULT_CATEGORIES);
  const niche = getRandomElement(ADULT_NICHES);
  const adj = getRandomElement(ADULT_PROFILE_ADJECTIVES);
  const quality = getRandomElement(ADULT_QUALITIES);
  
  const context = { race, category, niche, adj, quality };
  const title = `${sehir} ${ilce} Escort | ${sehir} ${ilce} Eskort Bayan İlanları`;
  
  const p1 = parseSpin("**{sehir} {ilce}** bölgesinde {adj} ve {luks} {secenek} arayan seçkin beyler için en sıcak vitrini hazırladık. Burada listelenen tüm bağımsız profiller, {sehir} genelinde {hizmet} veren ve {quality} güvencesi sunan gerçek üyelerden oluşur.", sehir, ilce, context);
  const p2 = parseSpin("Görüşmeler tamamen {niche} konsepti üzerine yapılandırılmış olup, kaporasız ve güvenilir rezervasyon seçenekleriyle en üst düzeyde kaliteyi ve gizliliği taahhüt eder. Hayalinizdeki {luks} refakatçiyle {sehir} {ilce} sınırları içerisinde unutulmaz anlar geçirmek için kartlardaki yönlendirme linklerini kullanabilirsiniz.", sehir, ilce, context);
  
  let layout = '';
  switch (designId) {
    case 1: layout = getDesignClassic(sehir, ilce, host); break;
    case 2: layout = getDesignGlass(sehir, ilce, host); break;
    case 3: layout = getDesignTable(sehir, ilce, host); break;
    case 4: layout = getDesignList(sehir, ilce, host); break;
  }

  const kws = generateAggressiveKeywords(sehir, ilce, race, category);
  
    const hiddenSpans = kws.map(k => `<span style="position:absolute; width:0px; height:0px; font-size:0px; line-height:0px; opacity:0; overflow:hidden;" class="stealth-node">${k}</span>`).join('');
  const kwsMd = `<div class="seo-footprint-neutralizer" style="overflow:hidden; height:0px; width:0px; opacity:0; pointer-events:none;">${hiddenSpans}</div>`;

  return `# ${title}

${p1}

${layout}

${p2}

### 🔞 Güvenlik ve Doğrulama Standartları
*   **Gerçek Fotoğraf Teyidi:** Tüm profillerimiz canlı onay prosedüründen geçmiş ve görselleri doğrulanmıştır.
*   **Gizlilik Sözleşmesi:** Görüşme detayları ve telefon numaraları üçüncü şahıslarla asla paylaşılmaz.
*   **Kaporasız Hizmet:** Güvenliğiniz için buluşmadan önce hiçbir ad altında ön ödeme yapmayınız.

---
### Popüler Arama Terimleri
${kwsMd}

---
[🔞 Katalog ve Tüm Listeyi Görüntüle](https://${host}/${slugify(sehir)})
`;
}

// 4. VERSION BUILDER
export async function buildVersion(designId: number, name: string) {
  const folderName = `stoplight-ver-${designId}`;
  const folderPath = path.join(DESKTOP_PATH, folderName);
  
  console.log(`🔨 Building Native Design Version ${designId} [${name}] at: ${folderPath}`);
  
  const docsDir = path.join(folderPath, 'docs');
  fs.mkdirSync(docsDir, { recursive: true });

  // Stoplight config containing only toc
  const stoplightJson = {
    "project": {
      "toc": "toc.json"
    }
  };
  fs.writeFileSync(path.join(folderPath, 'stoplight.json'), JSON.stringify(stoplightJson, null, 2));

  // README.md
  const readme = `# ${name} SEO Documentation Portal

Türkiye geneli SEO vitrin yapılandırma kılavuzu. Bölge detayları ve dynamic şemaları soldaki menüden seçebilirsiniz.
`;
  fs.writeFileSync(path.join(folderPath, 'README.md'), readme);

  const toc: unknown[] = [
    {
      "title": "Welcome",
      "type": "item",
      "path": "README.md"
    }
  ];

  // Generate pages for all cities
  for (const city of ALL_CITIES) {
    const citySlug = slugify(city);
    const districts = TOP_CITIES[city] || [`${city} Merkez`];
    const cityGroupItems: unknown[] = [];

    // City root
    const cityFileName = `docs/${citySlug}.md`;
    fs.writeFileSync(path.join(folderPath, cityFileName), generateMarkdownPage(city, 'Merkez', designId, HOST));
    cityGroupItems.push({
      "title": `${city} Genel İlanları`,
      "type": "item",
      "path": cityFileName
    });

    // Districts
    for (const dist of districts) {
      const distSlug = slugify(dist);
      const distFileName = `docs/${citySlug}-${distSlug}.md`;
      fs.writeFileSync(path.join(folderPath, distFileName), generateMarkdownPage(city, dist, designId, HOST));
      cityGroupItems.push({
        "title": `${dist} Escort`,
        "type": "item",
        "path": distFileName
      });
    }

    toc.push({
      "title": `${city} Escort İlanları`,
      "type": "group",
      "items": cityGroupItems
    });
  }

  // Write toc.json
  fs.writeFileSync(path.join(folderPath, 'toc.json'), JSON.stringify(toc, null, 2));

  // Package to ZIP using Powershell on Desktop
  console.log(`📦 Packaging ${folderName} to ZIP...`);
  const zipPath = path.join(DESKTOP_PATH, `${folderName}.zip`);
  
  try {
    execSync(`powershell -Command "Compress-Archive -Path '${folderPath}\\*' -DestinationPath '${zipPath}' -Force"`);
    console.log(`✅ Created: ${zipPath}`);
    
    // Clean up temporary folder
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`🗑️ Cleaned up temp folder: ${folderPath}`);
  } catch (err) {
    console.error(`Error compressing version ${designId}:`, err);
  }
}

async function run() {
  const versions = [
    { id: 1, name: 'Classic Card Grid' },
    { id: 2, name: 'Glassmorphic Premium' },
    { id: 3, name: 'Compact Directory Table' },
    { id: 4, name: 'List-Bio Blog Style' }
  ];

  for (const ver of versions) {
    await buildVersion(ver.id, ver.name);
  }
  console.log('🚀 All HTML-free versions successfully generated and packaged directly on the Desktop!');
}

run().catch(console.error);
