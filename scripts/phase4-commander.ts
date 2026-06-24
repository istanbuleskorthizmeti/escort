import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function runPhase4Sequence() {
  console.log('⚔️  [PHASE 4 COMMANDER] Initializing Fleet-Wide Warfare Sequence...');

  // --- STEP 1: Seeding Content ---
  console.log('\n🌱 [STEP 1/4] Running Programmatic Seeding (56 Domains)...');
  try {
    execSync('npx tsx scripts/nuclear-seeding-56-domains.ts', { stdio: 'inherit' });
    console.log('✅ Seeding completed successfully.');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Seeding failed, proceeding with sequence:', errMsg);
  }

  // --- STEP 2: Official GSC Indexing API Blast ---
  console.log('\n📡 [STEP 2/4] Triggering Official GSC Indexing API Blast on remote VPS...');
  try {
    execSync('npx tsx scripts/execute-gsc-indexing-api.ts', { stdio: 'inherit' });
    console.log('✅ GSC Indexing API execution triggered on remote server.');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ GSC Indexing API trigger failed:', errMsg);
  }

  // --- STEP 3: Social Signal backlinking ---
  console.log('\n💣 [STEP 3/4] Blasting Backlinks and Social Signals...');
  try {
    execSync('npx tsx scripts/nuclear-backlink-bomber.ts', { stdio: 'inherit' });
    console.log('✅ Social signal blast completed.');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Backlink bomber failed:', errMsg);
  }

  // --- STEP 4: Send Comprehensive Report ---
  console.log('\n🏆 [STEP 4/4] Sending Operation Victory Report to Telegram...');
  try {
    execSync('npx tsx scripts/send-comprehensive-report.ts', { stdio: 'inherit' });
    console.log('✅ Rapor Telegram grubuna iletildi.');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('❌ Report sending failed:', errMsg);
  }

  console.log('\n🏁 [PHASE 4 COMMANDER] All orchestration sequences completed.');
}

runPhase4Sequence().catch((err: unknown) => {
  const errMsg = err instanceof Error ? err.message : String(err);
  console.error('💥 Fatal error in Phase 4 Commander:', errMsg);
  process.exit(1);
});
