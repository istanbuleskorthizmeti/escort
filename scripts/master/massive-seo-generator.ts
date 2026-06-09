import { DOMAIN_MATRIX } from "../../config/domains";
import { cities } from "../../lib/locations";
import { generateEliteOmniContent } from "../../lib/ai-seo";
import { prisma } from "../../lib/prisma";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const SQL_FILE = "C:\\Users\\onurk\\esc\\scratch\\massive_seo_dump.sql";

async function generateMassiveSEO() {
  console.log("🚀 [HYDRA-SEO] Starting Massive Content Generation (Multi-Provider)...");
  
  if (!fs.existsSync(path.dirname(SQL_FILE))) {
    fs.mkdirSync(path.dirname(SQL_FILE), { recursive: true });
  }

  fs.writeFileSync(SQL_FILE, "-- HYDRA MASSIVE SEO DUMP v3.0\n\n", { encoding: 'utf8' });

  const domainsToProcess = DOMAIN_MATRIX.filter(d => d.role === 'MONEY_SITE' || d.role === 'SATELLITE');

  for (const domain of domainsToProcess) {
    const host = domain.host;
    console.log(`🌐 [PROCESS] Domain: ${host}`);

    // 1. Core Pages (Home, Rehber)
    const targets = [
      { slug: 'home', city: domain.targetCity || "İstanbul", district: domain.targetDistrict },
      { slug: 'rehber', city: domain.targetCity || "İstanbul", district: domain.targetDistrict }
    ];

    for (const target of targets) {
      try {
        const content = await generateEliteOmniContent({
          city: target.city,
          district: target.district,
          host: host
        });

        const sql = `INSERT INTO "PageContent" ("siteId", "slug", "title", "content", "updatedAt") 
VALUES ((SELECT "id" FROM "Site" WHERE "domain" = '${host}'), '${target.slug}', '${content.wordpress.title.replace(/'/g, "''")}', '${content.wordpress.content.replace(/'/g, "''")}', NOW())
ON CONFLICT ("slug", "siteId") DO UPDATE SET "title" = EXCLUDED."title", "content" = EXCLUDED."content", "updatedAt" = NOW();\n\n`;
        
        fs.appendFileSync(SQL_FILE, sql, { encoding: 'utf8' });

        // Direct DB Sync (Local)
        try {
          const site = await prisma.site.findUnique({ where: { domain: host } });
          if (site) {
            await prisma.pageContent.upsert({
              where: { slug_siteId: { slug: target.slug, siteId: site.id } },
              update: { title: content.wordpress.title, content: content.wordpress.content },
              create: { siteId: site.id, slug: target.slug, title: content.wordpress.title, content: content.wordpress.content }
            });
            console.log(`💾 [DB-SYNC] Synced: ${target.slug} for ${host}`);
          }
        } catch (dbErr) {
          console.warn(`⚠️ [DB-SYNC] Failed (skipping direct write): ${dbErr.message}`);
        }

        console.log(`✅ [CORE] Generated: ${target.slug} for ${host}`);
      } catch (e) {
        console.error(`❌ [CORE] Error ${host}:`, e);
      }
    }

    // 2. Main Site Matrix (39 Districts x 3 Niches)
    if (host.includes('istanbulescort.blog')) {
       const istanbulDistricts = cities['istanbul']?.districts || [];
       const niches = ["", "vip-escort", "escort-ajansi"]; // Prioritized niches

       for (const dist of istanbulDistricts.slice(0, 5)) {
          for (const niche of niches) {
             try {
                const content = await generateEliteOmniContent({
                  city: "istanbul",
                  district: dist.slug,
                  category: niche || undefined,
                  host: host
                });

                const slug = niche ? `istanbul-${dist.slug}-${niche}` : `istanbul-${dist.slug}`;

                const sql = `INSERT INTO "PageContent" ("siteId", "slug", "title", "content", "updatedAt") 
VALUES ((SELECT "id" FROM "Site" WHERE "domain" = '${host}'), '${slug}', '${content.wordpress.title.replace(/'/g, "''")}', '${content.wordpress.content.replace(/'/g, "''")}', NOW())
ON CONFLICT ("slug", "siteId") DO UPDATE SET "title" = EXCLUDED."title", "content" = EXCLUDED."content", "updatedAt" = NOW();\n\n`;
                
                fs.appendFileSync(SQL_FILE, sql, { encoding: 'utf8' });
                console.log(`✅ [MASSIVE] Saved: ${slug}`);
             } catch (e) {
                console.error(`❌ [MASSIVE] Error: ${dist.slug} - ${niche}`, e);
             }
          }
       }
    }
  }

  console.log("🏁 [HYDRA-SEO] Complete.");
}

generateMassiveSEO().catch(console.error);
