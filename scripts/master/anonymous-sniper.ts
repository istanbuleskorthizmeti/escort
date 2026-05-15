import 'dotenv/config';
import { telegraphService } from '../../lib/seo/telegraph';
import { generateGodModeOmniContent } from '../../lib/ai-seo';

/**
 * 💣 ANONYMOUS SNIPER (TELEGRAPH BLAST v1.0)
 * Rapidly creates anonymous, high-authority parasite pages.
 */

const LOCATIONS = [
  'İstanbul', 'Beşiktaş', 'Şişli', 'Kadıköy', 'Esenyurt', 
  'Beylikdüzü', 'Ataşehir', 'Bakırköy', 'Sarıyer', 'Florya'
];

async function runSniper() {
  console.log('🔫 [SNIPER] Initiating Anonymous Telegraph Strike...');

  for (const loc of LOCATIONS) {
    try {
      console.log(`🎯 [SNIPER] Targeting: ${loc}`);

      const content = await generateGodModeOmniContent({
        city: loc,
        host: 'telegra.ph',
        nicheType: 'Anonymous Parasite'
      });

      const url = await telegraphService.createPost({
        title: `${loc} VIP Escort - Elit ve Kaporasız Hizmet 2026`,
        author_name: 'DRKCNAY ELITE',
        content: content.wordpress.content
      });

      if (url) {
        console.log(`🚀 [SNIPER] Success: ${url}`);
      }

      // Small delay to prevent API rate limiting
      await new Promise(r => setTimeout(r, 3000));
    } catch (e: any) {
      console.error(`❌ [SNIPER] Failed for ${loc}:`, e.message);
    }
  }

  console.log('🏁 [SNIPER] Anonymous Strike Complete.');
}

if (require.main === module) {
  runSniper().then(() => process.exit(0));
}
