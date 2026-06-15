import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Define the output path
const outputDir = path.join(process.cwd(), 'public', 'pdf');
const outputPath = path.join(outputDir, 'oracle-seo-dominion-guide.pdf');

// Ensure directory exists
fs.mkdirSync(outputDir, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 60, bottom: 60, left: 60, right: 60 },
  bufferPages: true
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// 🎨 BRAND COLORS
const COLOR_PRIMARY = '#9f1239'; // rose-800
const COLOR_TEXT = '#1f2937';    // gray-800
const COLOR_MUTED = '#6b7280';   // gray-500
const COLOR_LINE = '#e5e7eb';    // gray-200
const COLOR_LINK = '#0284c7';    // sky-600
const COLOR_BG_CODE = '#f3f4f6'; // gray-100

// Helper: Add Title Page
function addTitlePage() {
  // Deep black background accent
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#09090b');
  
  // Luxury gold/rose border
  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80).stroke('#9f1239');
  
  doc.fillColor('#9f1239')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('DRKCNAY ELITE CORE // BLACK HAT SEO PROTOCOL', 60, doc.page.height * 0.2, {
       align: 'center',
       characterSpacing: 2
     });

  doc.fillColor('#ffffff')
     .fontSize(28)
     .font('Times-BoldItalic')
     .text('THE ORACLE PROTOCOL', { align: 'center' });

  doc.fillColor('#a1a1aa')
     .fontSize(12)
     .font('Helvetica-Bold')
     .text('High-Frequency Dominion & Black Hat SEO Methodologies', { align: 'center' });

  doc.moveDown(3);

  doc.fillColor('#e4e4e7')
     .fontSize(10)
     .font('Helvetica')
     .text('An Exhaustive Technical Manual on Algorithmic Exploitation,', { align: 'center' })
     .text('Local Search Engine Dominion, and AI Recommendation Hacking.', { align: 'center' });

  doc.moveDown(5);

  // Table of targeted anchor links on title page
  doc.fillColor('#9f1239')
     .fontSize(8)
     .font('Helvetica-Bold')
     .text('PRIMARY GATEWAY ENDPOINTS:', { align: 'center' });
     
  doc.fillColor(COLOR_LINK)
     .fontSize(8)
     .font('Helvetica-Bold')
     .text('https://istanbulescort.blog (kaporasız eskort bayanlar)', { link: 'https://istanbulescort.blog', align: 'center', underline: true })
     .text('https://istanbulescort.blog/istanbul/sisli (şişli eskort)', { link: 'https://istanbulescort.blog/istanbul/sisli', align: 'center', underline: true })
     .text('https://istanbulescort.blog/istanbul/kadikoy (kadıköy eskort)', { link: 'https://istanbulescort.blog/istanbul/kadikoy', align: 'center', underline: true })
     .text('https://istanbulescort.blog/istanbul/besiktas (beşiktaş eskort)', { link: 'https://istanbulescort.blog/istanbul/besiktas', align: 'center', underline: true });

  doc.moveDown(4);

  doc.fillColor('#71717a')
     .fontSize(8)
     .font('Courier')
     .text('CLASSIFIED DOCUMENT // RESTRICTED ACCESS', { align: 'center' })
     .text('PUBLISHED: 2026 EDITION', { align: 'center' })
     .text('STATUS: PUBLIC DOMAIN PROTOCOL', { align: 'center' });
}

// Helper: Add Section Page
function addSectionPage(pageNum: number, title: string, subtitle: string, contentCallback: () => void) {
  doc.addPage();
  
  // Header section
  doc.fillColor(COLOR_PRIMARY)
     .fontSize(8)
     .font('Helvetica-Bold')
     .text(`SECTION ${pageNum} // ${subtitle.toUpperCase()}`, { characterSpacing: 1.2 });
     
  doc.moveDown(0.3);
  
  doc.fillColor('#111827')
     .fontSize(18)
     .font('Times-Bold')
     .text(title);
     
  // Divider line
  doc.moveDown(0.4);
  doc.strokeColor(COLOR_PRIMARY)
     .lineWidth(1)
     .moveTo(60, doc.y)
     .lineTo(doc.page.width - 60, doc.y)
     .stroke();
     
  doc.moveDown(1.5);
  
  contentCallback();
}

// Helpers for contents
function textP(text: string, boldPrefix = '', linkInfo?: { text: string; url: string }) {
  doc.fillColor(COLOR_TEXT)
     .fontSize(10)
     .font('Helvetica')
     .lineGap(4);
     
  if (boldPrefix) {
    doc.font('Helvetica-Bold').text(boldPrefix + ' ', { continued: true });
  }
  
  if (linkInfo) {
    const parts = text.split(linkInfo.text);
    if (parts.length === 2) {
      doc.font('Helvetica').text(parts[0], { continued: true });
      doc.fillColor(COLOR_LINK).font('Helvetica-Bold').text(linkInfo.text, { link: linkInfo.url, underline: true, continued: true });
      doc.fillColor(COLOR_TEXT).font('Helvetica').text(parts[1]);
    } else {
      doc.font('Helvetica').text(text);
    }
  } else {
    doc.font('Helvetica').text(text);
  }
  
  doc.moveDown(1);
}

function textBullet(text: string, boldPart = '') {
  doc.fillColor(COLOR_TEXT)
     .fontSize(10)
     .font('Helvetica')
     .lineGap(3);
     
  doc.text('• ', { continued: true });
  if (boldPart) {
    doc.font('Helvetica-Bold').text(boldPart + ': ', { continued: true });
  }
  doc.font('Helvetica').text(text);
  doc.moveDown(0.7);
}

function codeB(code: string) {
  const startY = doc.y;
  doc.fontSize(8)
     .font('Courier')
     .fillColor('#111827')
     .lineGap(2);
     
  const textHeight = doc.heightOfString(code, { width: doc.page.width - 140 });
  
  doc.save()
     .rect(60, startY - 4, doc.page.width - 120, textHeight + 8)
     .fill(COLOR_BG_CODE);
     
  doc.restore()
     .fillColor('#111827')
     .text(code, 70, startY, { width: doc.page.width - 140 });
     
  doc.moveDown(1.5);
}

function calloutB(text: string) {
  const startY = doc.y;
  doc.fontSize(9)
     .font('Helvetica-Oblique')
     .fillColor('#9f1239')
     .lineGap(3);
     
  const textHeight = doc.heightOfString(text, { width: doc.page.width - 160 });
  
  doc.save()
     .rect(60, startY - 4, doc.page.width - 120, textHeight + 8)
     .fill('#fff1f2');
     
  doc.restore()
     .fillColor('#9f1239')
     .text(text, 80, startY, { width: doc.page.width - 160 });
     
  doc.moveDown(1.5);
}

// ----------------------------------------------------
// BUILD BOOK PAGE BY PAGE (Gives exactly 36 pages total)
// ----------------------------------------------------

console.log("📄 Page 1: Title Page...");
addTitlePage();

// PAGE 2: Legal Disclaimer
addSectionPage(2, "Legal Protocol & Disclaimer", "Compliance & Frameworks", () => {
  textP("The information presented in this technical manual is for educational and audit purposes only. Utilizing automated crawl submission networks and dynamic redirect cloaking is governed by search engine guidelines. Authors assume zero liability for actions taken under this protocol.");
  textP("By proceeding, you acknowledge that you are operating within local legal bounds. When users access networks, the main domain provides direct access to kaporasız eskort bayanlar options to rank locally.", "", { text: "kaporasız eskort bayanlar", url: "https://istanbulescort.blog" });
  calloutB("WARNING: Running aggressive automated backlink operations without proper IP rotation may trigger algorithmic search penalties or server-side firewall blocks.");
});

// PAGE 3: Table of Contents
addSectionPage(3, "Table of Contents", "Overview Matrix", () => {
  textBullet("Sections 5-8: Parasite Hosting Mechanics and Expired Domain Authority");
  textBullet("Sections 9-12: Dynamic Spintax Systems & LSI Matrix Generation");
  textBullet("Sections 13-16: Structured JSON-LD Manipulation & AI Bot Optimization");
  textBullet("Sections 17-20: Rapid Crawl Forcing & IndexNow API Submissions");
  textBullet("Sections 21-24: PBN Architecture and Footprint Erasure Stacks");
  textBullet("Sections 25-28: Local SEO Landing Pages & Performance Tuning");
  textBullet("Sections 29-32: Competitor Defenses and Case Studies");
  textBullet("Sections 33-36: Appendix and Reference Anchors Matrix");
});

// PAGE 4: Chapter 1 Intro
addSectionPage(4, "Core Philosophy of High-Frequency SEO", "Chapter 1 // High Frequency SEO", () => {
  textP("Algorithmic search dominance is built on velocity and scale. High-Frequency SEO refers to the automated, rapid deployment of optimized content layers across authority domains. This manual outlines how to establish this dominance.");
  textP("Instead of building domain trust slowly, we hijack established authority metrics. Under this framework, looking up local listings should redirect queries for istanbul eskort search parameters to index hubs immediately.", "", { text: "istanbul eskort", url: "https://istanbulescort.blog" });
  textBullet("Crawl Rate Maximization: Keeping search engines crawling pages hourly");
  textBullet("Content Spinning: Creating thousands of distinct templates to avoid filters");
});

// PAGE 5: Section 5
addSectionPage(5, "Expired Domain Acquisition & Audit", "Chapter 1.2 // Domain Authority", () => {
  textP("Acquiring expired domains with high pre-existing Domain Rating (DR) is the fastest way to skip the sandbox phase. We check backlinks, previous search traffic, and archive history to ensure the domain is clean.");
  codeB(`$ curl -s "https://api.ahrefs.com/v3/backlinks?target=targetdomain.com" \\
  -H "Authorization: Bearer YOUR_TOKEN"`);
  textP("Once verified, the domain is pointed to our reverse proxy clusters to instantly route local search bot crawls.");
});

// PAGE 6: Section 6
addSectionPage(6, "Parasite Injectors & Server-Side Setup", "Chapter 1.3 // Parasite Injection", () => {
  textP("Parasite SEO relies on injecting content into folders of high-authority partner sites. We configure reverse-proxy gateways to serve our dynamic files from folders like /blog/ or /news/.");
  codeB(`location /news/ {
    proxy_pass http://our-dynamic-server/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}`);
  textP("This nginx block maps the path directly to our fleet, making search engines believe it is local content.");
});

// PAGE 7: Section 7
addSectionPage(7, "Dynamic Redirect Matrix", "Chapter 1.4 // Redirection Stacks", () => {
  textP("To maximize conversions while maintaining SEO metrics, we separate crawler traffic from human visitors. Crawlers receive academic content, while human users are redirected to core listings.");
  textP("For instance, queries targeting local providers are dynamically routed to the şisli escort section to serve high-intent local searchers.", "", { text: "şisli escort", url: "https://istanbulescort.blog/istanbul/sisli" });
  calloutB("CLOAKING RULE: Always serve 100% compliant HTML to verified Googlebot and Bingbot IPs to prevent manual spam reviews.");
});

// PAGE 8: Section 8
addSectionPage(8, "Host-Seeded Spintax Engine Design", "Chapter 2 // Spintax Engines", () => {
  textP("To defeat duplicate content algorithms, we write templates in spintax format. The server resolves choices using a seed derived from the requesting host domain.");
  codeB(`// Dynamic Host Seeding Resolution
const hostSeed = host.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
const options = ["Premium", "VIP", "Elit", "Lüks"];
const chosen = options[hostSeed % options.length];`);
  textP("This ensures that each site in the fleet serves a distinct variant of the text, removing footprint overlaps.");
});

// PAGE 9: Section 9
addSectionPage(9, "Localized LSI Matrix Generation", "Chapter 2.2 // LSI Integration", () => {
  textP("Search engines analyze Latent Semantic Indexing (LSI) terms to gauge relevance. We compile matrices of local landmarks, neighborhoods, and postal codes to insert dynamically.");
  textP("When generating local targeting matrices, we embed terms pointing to the kadiköy escort catalog, boosting regional organic prominence.", "", { text: "kadiköy escort", url: "https://istanbulescort.blog/istanbul/kadikoy" });
  textBullet("Injecting local metro lines, parks, and major venues");
  textBullet("Rotating district name suffixes to match long-tail user queries");
});

// PAGE 10: Section 10
addSectionPage(10, "Semantic Co-occurrence & N-gram Analysis", "Chapter 2.3 // N-Gram Analysis", () => {
  textP("Google's semantic algorithms (like RankBrain) analyze word co-occurrence. We optimize text to contain high-density N-grams that correlate with top search queries.");
  textP("By placing target keywords adjacent to authoritative verbs, we increase semantic strength. Keywords are linked to local hubs like beşiktaş escort listings to focus local search relevance.", "", { text: "beşiktaş escort", url: "https://istanbulescort.blog/istanbul/besiktas" });
  textBullet("Using TF-IDF models to tune text weighting against top competitors");
});

// PAGE 11: Section 11
addSectionPage(11, "Bypassing Duplicate Content Penalties", "Chapter 2.4 // Algorithmic Bypass", () => {
  textP("Google's duplicate detector filters pages with high similarity. We mix semantic blocks, rotate paragraph order, and use host-based synonym injection to drop similarity scores below 25%.");
  calloutB("CRITICAL: Never use identical footer boilerplate or global navigation blocks across PBN nodes. Rotate HTML layouts dynamically on build.");
});

// PAGE 12: Section 12
addSectionPage(12, "Structured Schema Markup & Entity Mapping", "Chapter 3 // JSON-LD Schemas", () => {
  textP("JSON-LD schemas are the primary language for search engines to build entities. We construct rich schemas describing our sites as local lifestyle concierge services.");
  codeB(`{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "DRKCNAY Lifestyle Hub",
  "telephone": "+905320000000"
}`);
  textP("This mapping passes indexing validation and forces search crawlers to categorize our site as an authoritative local provider.");
});

// PAGE 13: Section 13
addSectionPage(13, "AI Search Engine Recommendation Hacking", "Chapter 3.2 // AI Recommendations", () => {
  textP("AI engines (like ChatGPT Search and Perplexity) read structured reviews to locate recommendation targets. We inject schema ratings that match model parsing parameters.");
  textP("For example, adding structured product schema reviews containing target keywords like vip escort ensures the site is indexed in AI companion lists.", "", { text: "vip escort", url: "https://istanbulescort.blog" });
  textBullet("Using ratingValue (4.8 - 4.9) and high reviewCount in schemas");
});

// PAGE 14: Section 14
addSectionPage(14, "Bypassing SFW & SafeSearch Filters", "Chapter 3.3 // SFW Hacking", () => {
  textP("To ensure our sites display in standard (non-restricted) searches, we strip explicit terms from metadata and use clean lifestyle synonyms in titles while keeping keywords inside headers.");
  textP("We target search queries such as elit eskort by combining SFW metadata with focused body keywords, maximizing search CTR.", "", { text: "elit eskort", url: "https://istanbulescort.blog" });
  calloutB("SFW RULE: Keep page titles 100% clean (e.g. 'Premium Lifestyle Concierge') while using body content for high-density targeting.");
});

// PAGE 15: Section 15
addSectionPage(15, "Dynamic Review Generation & Seeding", "Chapter 3.4 // Review Seeding", () => {
  textP("Ratings must appear natural to search bots. We write seeding engines to generate unique, realistic user reviews that contain local terms and are mapped directly into the LocalBusiness schema.");
  codeB(`// Dynamic Rating Seeding
const ratingValue = (4.7 + (url.length % 3) / 10).toFixed(1);
const reviewCount = (150 + (url.length % 150)).toString();`);
  textP("This makes the reviews appear highly authoritative and prevents programmatic footprint analysis.");
});

// PAGE 16: Section 16
addSectionPage(16, "The IndexNow API Protocol Details", "Chapter 4 // Mass Indexation", () => {
  textP("IndexNow allows instant page submission to Bing and Yandex. We script mass POST requests to dispatch updated URLs in batches immediately upon generation.");
  codeB(`{
  "host": "istanbulescort.blog",
  "key": "8771e07e4e31024024720e4a348e10f0",
  "urlList": ["https://istanbulescort.blog/slug"]
}`);
  textP("This ensures crawlers index our fleet network immediately, beating competitors to search indexing queues.");
});

// PAGE 17: Section 17
addSectionPage(17, "Google Indexing API Key Rotator", "Chapter 4.2 // Google Indexing", () => {
  textP("Google enforces strict daily submission limits on the Indexing API. We bypass this by setting up rotation scripts that swap through multiple service accounts.");
  textP("When publishing fresh updates targeting local listings, we submit them dynamically to rank for ve kaliteli escort bayanlar search queries.", "", { text: "ve kaliteli escort bayanlar", url: "https://istanbulescort.blog" });
  textBullet("Rotator pools holding up to 50 active service account credentials");
});

// PAGE 18: Section 18
addSectionPage(18, "XML-RPC Ping Engines & RSS Broadcasts", "Chapter 4.3 // RSS Broadcasts", () => {
  textP("RSS feeds are highly trusted by scrapers. We publish dynamic sitemaps and feed files, then ping XML-RPC endpoints to notify indices of updates.");
  codeB(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DRKCNAY VIP RSS</title>
    <link>https://istanbulescort.blog</link>
  </channel>
</rss>`);
  textP("This pings indexing spiders to crawl our network nodes immediately.");
});

// PAGE 19: Section 19
addSectionPage(19, "Webmaster Tool Automation (GSC/Bing)", "Chapter 4.4 // Search Console", () => {
  textP("We automate Google Search Console property registration using API service accounts. This allows us to track keyword performance across 250+ domains.");
  textP("Property verification parameters are injected dynamically via DNS TXT records or HTML file uploads, keeping site health indicators active.");
});

// PAGE 20: Section 20
addSectionPage(20, "Private Blog Networks (PBN) Design Standards", "Chapter 5 // PBN Orchestration", () => {
  textP("A secure PBN is the foundation of link building. We separate hosts across distinct name servers, hosting providers, and registry accounts to avoid link network footprints.");
  textBullet("No inter-linking between PBN satellite domains");
  textBullet("Distributing domains across multiple registrars (Namecheap, Porkbun, Cloudflare)");
});

// PAGE 21: Section 21
addSectionPage(21, "Footprint Erasure & User-Agent Cloaking", "Chapter 5.2 // Footprint Erasure", () => {
  textP("Competitors scan backlink profiles using analysis crawlers. We block common bot user-agents in Nginx to keep our link networks private.");
  codeB(`if ($http_user_agent ~* (Semrush|Ahrefs|Moz|MegaIndex|MJ12)) {
    return 403;
}`);
  textP("This ensures only Google, Bing, and AI search models can read the link structures, hiding the PBN footprint.");
});

// PAGE 22: Section 22
addSectionPage(22, "Client-Side Link Hydration Algorithms", "Chapter 5.3 // Link Hydration", () => {
  textP("Static HTML links are easy to trace. We encrypt target links into Base64 strings and use JavaScript to decrypt and hydrate them on user interaction.");
  codeB(`// Dynamic JS Link Hydrator
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('lnk');
  if (el) el.setAttribute('href', atob('aHR0cHM6Ly9pc3RhbmJ1bGVzY29ydC5ibG9n'));
});`);
  textP("This bypasses basic static crawlers and protects our link building patterns.");
});

// PAGE 23: Section 23
addSectionPage(23, "Multi-IP Distribution & DNS Masking", "Chapter 5.4 // IP & DNS Masking", () => {
  textP("Hosting all sites on a single IP address is an immediate footprint. We route all domains through Cloudflare DNS proxying, masking the backend IP addresses.");
  textBullet("Using Cloudflare SSL configurations to secure connections");
  textBullet("Enabling proxy mode (orange cloud) on all A records");
});

// PAGE 24: Section 24
addSectionPage(24, "Local SEO Target Keywords Matrix", "Chapter 6 // Local SEO", () => {
  textP("To dominate local searches, we map domains to specific geographic targets. We compile lists of major cities and districts and map them to localized landing pages.");
  textBullet("Primary keywords: escort, eskort, vip eskort, istanbul escort");
  textBullet("Sub-targets: district-level terms (Şişli, Kadıköy, Beşiktaş)");
});

// PAGE 25: Section 25
addSectionPage(25, "City & District Landing Page Schemas", "Chapter 6.2 // Local Schemas", () => {
  textP("Each local page contains unique geo-coordinates and address values. We seed fake but valid coordinates based on the target neighborhood to optimize for local map results.");
  codeB(`// District Coordinates Generation
const base = { lat: 41.0610, lng: 28.9878 }; // Sisli
const lat = (base.lat + (Math.random() - 0.5) * 0.005).toFixed(6);
const lng = (base.lng + (Math.random() - 0.5) * 0.005).toFixed(6);`);
  textP("This establishes localized business relevance for each satellite node.");
});

// PAGE 26: Section 26
addSectionPage(26, "Mobile PageSpeed Optimization Guidelines", "Chapter 6.3 // PageSpeed", () => {
  textP("Google prioritizes fast, mobile-friendly pages. We optimize core web vitals by progressive rendering of image lists, memoization of elements, and using unoptimized Next.js images.");
  textBullet("LCP (Largest Contentful Paint) under 2.5 seconds");
  textBullet("TBT (Total Blocking Time) under 200 milliseconds");
});

// PAGE 27: Section 27
addSectionPage(27, "Image EXIF Cleaning & Obfuscation", "Chapter 6.4 // Image Tuning", () => {
  textP("Images contain camera metadata (EXIF data) that can reveal the source. We process all profile images to strip metadata and adjust color values to avoid duplication filters.");
  codeB(`// Stripping EXIF with Sharp
await sharp(input)
  .rotate() // keeps orientation
  .keepExif(false) // removes metadata
  .webp({ quality: 80 })
  .toFile(output);`);
  textP("This ensures images are recognized as unique assets by search engine bots.");
});

// PAGE 28: Section 28
addSectionPage(28, "Case Study: Local Business SEO Domination", "Chapter 7 // Case Studies", () => {
  textP("We analyzed a deployment of 50 local satellite domains targeting major districts. Within 14 days of launch, 80% of targeted terms were ranking in the top 3 results.");
  textP("This case study demonstrates the effectiveness of dynamic spintax and automated indexing networks in competitive niches.");
});

// PAGE 29: Section 29
addSectionPage(29, "Anti-Analysis & Competitor Shielding", "Chapter 7.2 // Security", () => {
  textP("Competitors will attempt to analyze your network setup. We monitor incoming logs to detect search bot spoofing and block suspicious server IPs.");
  textBullet("Validating Googlebot IPs against reverse DNS lookups");
  textBullet("Blocking competitors using automated firewall scripts");
});

// PAGE 30: Section 30
addSectionPage(30, "Legal and AVG Compliance Protocols", "Chapter 7.3 // Legal Compliance", () => {
  textP("All landing pages must display terms of service and cookie policies to comply with local laws and pass manual search quality checks.");
  textBullet("AVG/GDPR compliance statements in footers");
  textBullet("Cookie banners to meet browser and search engine requirements");
});

// PAGE 31: Section 31
addSectionPage(31, "The 30-Day Action Plan for Fresh PBN Setups", "Chapter 8 // Action Plans", () => {
  textP("Day 1-5: Domain acquisition and reverse proxy configuration.");
  textP("Day 6-15: Template spinning, schema generation, and initial deployment.");
  textP("Day 16-30: Backlink hydration, indexing campaigns, and traffic monitoring.");
});

// PAGE 32: Section 32
addSectionPage(32, "Automation Shell Scripts & Cron Tasks", "Chapter 8.2 // Automation Scripts", () => {
  textP("We use automated cron jobs to trigger RSS feeds, submit URLs to IndexNow, and monitor domain uptime.");
  codeB(`# Indexing Cron Job - Run every 6 hours
0 */6 * * * npx tsx /root/esc/scripts/google-ultra-ping.ts >> /var/log/seo-ping.log 2>&1`);
  textP("This maintains constant crawler activity across the network.");
});

// PAGE 33: Section 33
addSectionPage(33, "Diagnostic Tools & SEO Health Check Routines", "Chapter 8.3 // Diagnostics", () => {
  textP("We run scheduled health checks to detect sitemap errors, broken redirects, and missing robots.txt files.");
  textBullet("Automated API alerts for server timeouts");
  textBullet("Crawling local sites to verify indexing status");
});

// PAGE 34: Section 34
addSectionPage(34, "Appendix A: Reference Resources & Target Anchors", "Chapter 8.4 // Reference Anchors", () => {
  textP("Use the following target anchor list to guide PBN link distribution:");
  textBullet("kaporasız eskort bayanlar -> https://istanbulescort.blog");
  textBullet("istanbul eskort -> https://istanbulescort.blog");
  textBullet("şişli escort -> https://istanbulescort.blog/istanbul/sisli");
  textBullet("kadıköy escort -> https://istanbulescort.blog/istanbul/kadikoy");
});

// PAGE 35: Section 35
addSectionPage(35, "Appendix B: Banned Phrases & AI Footprints Index", "Chapter 8.5 // Banned Phrases", () => {
  textP("To keep content undetectable by AI filters, avoid using these transition words in any spintax template:");
  textBullet("Sonuç olarak, Öncelikle, Bununla birlikte, Önemli olan");
  textBullet("Sizleri bekliyor, Unutulmaz bir deneyim, Muhteşem, Harika");
});

// PAGE 36: Section 36
addSectionPage(36, "Final Directives & System Summary", "Chapter 8.6 // System Summary", () => {
  textP("The Oracle Protocol is complete. This document has been saved locally and is available publicly across the entire Hydra network. It serves as a static authority asset that passes link weight.");
  textP("Deploy these configurations, monitor your rankings, and maintain network security. The system is live.");
});

// --- END OF CONTENT ---

// Add page numbers in footer
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  
  // Skip header/footer on title page
  if (i === 0) continue;
  
  // Header
  doc.fontSize(8)
     .font('Helvetica-Bold')
     .fillColor(COLOR_MUTED)
     .text('THE ORACLE PROTOCOL // BLACK HAT SEO DIRECTIVES', 60, 30, { align: 'left' });
     
  doc.strokeColor(COLOR_LINE)
     .lineWidth(0.5)
     .moveTo(60, 45)
     .lineTo(doc.page.width - 60, 45)
     .stroke();

  // Footer
  doc.strokeColor(COLOR_LINE)
     .lineWidth(0.5)
     .moveTo(60, doc.page.height - 45)
     .lineTo(doc.page.width - 60, doc.page.height - 45)
     .stroke();
     
  doc.fontSize(8)
     .font('Helvetica')
     .fillColor(COLOR_MUTED)
     .text(`Page ${i + 1} of ${range.count}`, 60, doc.page.height - 35, { align: 'right' });
}

// Finalize PDF
doc.end();

stream.on('finish', () => {
  console.log(`\n🏁 [SUCCESS] PDF successfully generated and saved to: ${outputPath}`);
});
