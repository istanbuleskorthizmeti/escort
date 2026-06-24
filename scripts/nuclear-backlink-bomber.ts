import { SocialBomber } from '../lib/seo/social-bomber';
import { DOMAIN_MATRIX } from '../config/domains';

async function runBacklinkBomber() {
  console.log('☢️ [NUCLEAR BACKLINK BOMBER] Initializing blast sequence...');

  // Select active money sites and key satellites to blast
  const targets = DOMAIN_MATRIX.filter(
    (d) => d.role === 'MONEY_SITE' || d.category === 'MONEY_SITE'
  );

  if (targets.length === 0) {
    console.log('⚠️ No active target domains found in DOMAIN_MATRIX.');
    return;
  }

  console.log(`📡 Found ${targets.length} target domains for social signal injection.`);

  for (const target of targets) {
    const homeUrl = `https://${target.host}`;
    const pageTitle = `${target.host.toUpperCase()} - Premium VIP Escort Directory`;

    try {
      console.log(`💣 Blasting signals for domain: ${target.host}`);
      await SocialBomber.blast(homeUrl, pageTitle);
      
      // Delay to avoid overwhelming the endpoints and mimic natural behavior
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`❌ Failed to blast signals for ${target.host}:`, errMsg);
    }
  }

  console.log('🏆 [FINISHED] Nuclear Backlink Bomber finished execution.');
}

runBacklinkBomber().catch((err: unknown) => {
  const errMsg = err instanceof Error ? err.message : String(err);
  console.error('💥 Fatal error in Nuclear Backlink Bomber:', errMsg);
  process.exit(1);
});
