import { googleAuth } from '../lib/google-auth';
import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const ssh = new NodeSSH();

const SOURCE_DIR = 'C:\\Users\\onurk\\Desktop\\readme-docs-dorukcanay';
const readmeSubdomain = process.env.README_SUBDOMAIN || "istanbul-eskort-hizmeti";
const readmeBaseUrl = `https://${readmeSubdomain}.readme.io`;

async function run() {
  console.log('🚀 Loading all generated ReadMe documentation pages...');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory ${SOURCE_DIR} not found.`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR);
  const slugs = files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  
  const urls = [
    `${readmeBaseUrl}/docs/getting-started`,
    ...slugs.map(s => `${readmeBaseUrl}/docs/${s}`)
  ];

  console.log(`📋 Loaded ${urls.length} URLs for sitemap and feed generation.`);

  // 1. Generate Sitemap XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  const localSitemapPath = path.join(process.cwd(), 'public', 'sitemap-readme.xml');
  fs.writeFileSync(localSitemapPath, sitemapXml);
  console.log(`📝 Local sitemap written: ${localSitemapPath}`);

  // 2. Generate RSS Feed XML
  const now = new Date().toUTCString();
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>İstanbul Vip Escort Hizmeti - Güncel Rehberler</title>
  <link>${readmeBaseUrl}</link>
  <description>İstanbul tüm ilçeleri için VIP eskort hizmeti rehberleri ve güncel duyurular.</description>
  <language>tr</language>
  <pubDate>${now}</pubDate>
  <lastBuildDate>${now}</lastBuildDate>
${urls.map(url => `  <item>
    <title>İstanbul Vip Escort Hizmeti - Güncel Portalı</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <pubDate>${now}</pubDate>
    <description><![CDATA[İstanbul Vip Escort hizmeti ve ilçelere göre özel bağımsız bireysel model rehberi.]]></description>
  </item>`).join('\n')}
</channel>
</rss>`;

  const localRssPath = path.join(process.cwd(), 'public', 'feed-readme.xml');
  fs.writeFileSync(localRssPath, rssXml);
  console.log(`📝 Local RSS feed written: ${localRssPath}`);

  // 3. Connect to SSH and Deploy
  try {
    console.log('📡 Connecting to Production Server...');
    await ssh.connect({
      host: '31.97.79.34',
      port: 22,
      username: 'root',
      password: 'Oym@icdLt?vY8YQy'
    });
    console.log('✅ Connected to VPS.');

    const remoteSitemapPath = '/var/www/escortvip/public/sitemap-readme.xml';
    const remoteRssPath = '/var/www/escortvip/public/feed-readme.xml';

    // Upload sitemap
    const sitemapBase64 = Buffer.from(sitemapXml).toString('base64');
    await ssh.execCommand(`mkdir -p /var/www/escortvip/public`);
    await ssh.execCommand(`echo "${sitemapBase64}" | base64 -d > ${remoteSitemapPath}`);
    console.log(`📤 Uploaded remote sitemap: ${remoteSitemapPath}`);

    // Upload RSS
    const rssBase64 = Buffer.from(rssXml).toString('base64');
    await ssh.execCommand(`echo "${rssBase64}" | base64 -d > ${remoteRssPath}`);
    console.log(`📤 Uploaded remote RSS: ${remoteRssPath}`);

    // Reload nginx to clear any routing caches
    console.log('🧹 Reloading nginx configuration...');
    await ssh.execCommand('nginx -t && systemctl reload nginx');
    console.log('✅ Nginx reloaded.');

    console.log('🎉 Uploads completed! Feeds are live at:');
    console.log(`🔗 https://dorukcanay.digital/sitemap-readme.xml`);
    console.log(`🔗 https://dorukcanay.digital/feed-readme.xml`);

    // 4. Submit to GSC API
    console.log('\n📡 Submitting feeds to Google Search Console via API...');
    
    const targets = [
      { site: 'https://dorukcanay.digital/', feed: 'https://dorukcanay.digital/sitemap-readme.xml' },
      { site: 'https://dorukcanay.digital/', feed: 'https://dorukcanay.digital/feed-readme.xml' },
      { site: 'https://istanbul-eskort-hizmeti.readme.io/', feed: 'https://dorukcanay.digital/sitemap-readme.xml' },
      { site: 'https://istanbul-eskort-hizmeti.readme.io/', feed: 'https://dorukcanay.digital/feed-readme.xml' }
    ];

    for (const target of targets) {
      console.log(`⏳ Submitting ${target.feed} for GSC property ${target.site}...`);
      const success = await googleAuth.submitSitemap(target.site, target.feed);
      if (success) {
        console.log(`   ✅ Submitted successfully!`);
      } else {
        console.warn(`   ⚠️ Submission failed/skipped.`);
      }
    }

  } catch (err: any) {
    console.error('❌ SSH/Submission Deployment Failed:', err.message);
  } finally {
    ssh.dispose();
    process.exit(0);
  }
}

run().catch(console.error);
