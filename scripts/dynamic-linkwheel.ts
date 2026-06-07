import 'dotenv/config';
import { prisma } from '../lib/prisma';
import { sendTelegramReport } from '../lib/telegram';

interface LinkNode {
  domain: string;
  id: string;
}

async function buildDynamicLinkWheel() {
  console.log('🔗 [LINKWHEEL] Initiating Footprint-Free Link Wheel Construction...');
  
  try {
    const activeSites = await prisma.site.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true, domain: true }
    });

    if (activeSites.length < 3) {
      console.log('⚠️ [LINKWHEEL] Not enough active sites (minimum 3 required) to build a robust wheel.');
      return;
    }

    // Shuffle array randomly to eliminate sequential footprints
    const shuffledSites: LinkNode[] = activeSites.sort(() => Math.random() - 0.5);
    console.log(`📡 [LINKWHEEL] Shuffled Site Order for Link Wheel:`, shuffledSites.map(s => s.domain));

    const totalNodes = shuffledSites.length;
    let successfulLinks = 0;

    for (let i = 0; i < totalNodes; i++) {
      const sourceNode = shuffledSites[i];
      // Target is the next node in the ring structure
      const targetNode = shuffledSites[(i + 1) % totalNodes];

      // Define non-direct patterns: target specific geo dynamic pages
      const targetPath = `/istanbul/${['kadikoy', 'sisli', 'esenyurt', 'besiktas', 'umraniye'][Math.floor(Math.random() * 5)]}`;
      const anchorText = [
        'En Güvenilir Hizmet',
        'VIP Escort Rezervasyon',
        'Detaylı Bilgi İçin Tıklayın',
        targetNode.domain,
        'Otel ve Eve Gelen Partnerler'
      ][Math.floor(Math.random() * 5)];

      const linkHtml = `<p>Tavsiye Edilen Partner Portalı: <a href="https://${targetNode.domain}${targetPath}" title="${anchorText}">${anchorText}</a></p>`;

      // Inject the link into a random existing content page of the source site
      const sourcePages = await prisma.pageContent.findMany({
        where: { siteId: sourceNode.id }
      });

      if (sourcePages.length > 0) {
        const targetPage = sourcePages[Math.floor(Math.random() * sourcePages.length)];
        
        // Append link to content if not already present
        if (!targetPage.content.includes(targetNode.domain)) {
          const updatedContent = `${targetPage.content}\n\n${linkHtml}`;
          
          await prisma.pageContent.update({
            where: { id: targetPage.id },
            data: { content: updatedContent, updatedAt: new Date() }
          });

          console.log(`✅ [LINKWHEEL] Injected: ${sourceNode.domain} (${targetPage.slug}) -> https://${targetNode.domain}${targetPath}`);
          successfulLinks++;
        }
      }

      // Random sleep (3000ms to 7000ms) to bypass automated pattern scanning
      await new Promise(r => setTimeout(r, 3000 + Math.random() * 4000));
    }

    const victoryMsg = `🔗 <b>[HYDRA LINKWHEEL CONQUEST]</b>\n` +
      `✅ <b>Bağlantı Çarkı Kuruldu:</b> ${successfulLinks} adet bağlantı rastgele örüntülerle yerleştirildi.\n` +
      `🛡️ <b>OpSec Durumu:</b> Sıralı ayak izi (footprint) engellendi. Class-C IP dağılımları aktif.`;

    await sendTelegramReport(victoryMsg);
    console.log('🏁 [LINKWHEEL] Dynamic Link Wheel Complete.');

  } catch (err: any) {
    console.error('❌ [LINKWHEEL ERROR] Execution failed:', err.message);
    await sendTelegramReport(`❌ <b>[HYDRA LINKWHEEL HATA]</b>\n${err.message}`);
  }
}

if (require.main === module) {
  buildDynamicLinkWheel().then(() => process.exit(0)).catch(console.error);
}
