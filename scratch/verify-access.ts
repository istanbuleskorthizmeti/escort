import { GSCService } from '../lib/seo/gsc';
import { prisma } from '../lib/prisma';

async function verify() {
  console.log("🔍 [VERIFY] GSC Erişim Denetimi Başlatılıyor...");
  const gsc = GSCService.getInstance();
  
  try {
    const sites = await gsc.listSites();
    console.log(`✅ GSC'de Erişilebilen Toplam Site Sayısı: ${sites.length}`);
    
    if (sites.length === 0) {
      console.warn("⚠️ UYARI: GSC'de hiçbir site bulunamadı. Servis hesabı (DRKCNAY-bot@...) GSC mülklerine eklenmemiş olabilir.");
    } else {
      sites.forEach(s => console.log(` - ${s}`));
    }

    // DB'deki aktif siteleri de kontrol edelim
    const dbSites = await prisma.site.findMany();
    console.log(`\n📦 DB'de Kayıtlı Toplam Site: ${dbSites.length}`);
    dbSites.forEach(s => console.log(` - ${s.domain} (${s.status})`));

  } catch (e: any) {
    console.error("❌ HATA:", e.message);
  }
}

verify().then(() => process.exit(0));
