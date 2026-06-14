
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function getGA4Code() {
    console.log("🔍 Veritabanından GA4 kodun sorgulanıyor...");
    try {
        const domain = process.env.SITE_DOMAIN || "istanbulescort.blog";
        const site = await prisma.site.findUnique({
            where: { domain: domain }
        });

        if (site) {
            console.log(`\n✅ DOMAIN: ${site.domain}`);
            console.log(`🎯 GA4 MEASUREMENT ID: ${site.ga4MeasurementId || "Tanımlanmamış"}`);
            console.log(`📊 HEALTH SCORE: ${site.healthScore}`);
            console.log(`🛡️ GSC VERIFIED: ${site.gscVerified ? "EVET" : "HAYIR"}`);
        } else {
            console.log(`\n⚠️ ${domain} için veritabanında bir kayıt bulunamadı.`);
            // Tüm siteleri listele belki başka bir isimle kayıtlıdır
            const allSites = await prisma.site.findMany({ select: { domain: true, ga4MeasurementId: true } });
            console.log("\n📋 Mevcut Diğer Siteler:");
            allSites.forEach(s => console.log(`- ${s.domain}: ${s.ga4MeasurementId || 'N/A'}`));
        }
    } catch (e: any) {
        console.error("❌ Veritabanı hatası:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

getGA4Code();
