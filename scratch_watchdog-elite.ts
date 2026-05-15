import { spawnSync } from 'child_process';

/**
 * 🪐 DRKCNAY ELITE: 7/24 GLOBAL WATCHDOG (v2.0)
 * The autonomous heart of the SEO ecosystem.
 * Ensures persistent hydration, interlinking, and indexing.
 */

const CONFIG = {
  MIN_INTERVAL_MINS: 30,
  MAX_INTERVAL_MINS: 75,
  SCRIPTS: [
    { name: 'TUMBLR_SOCIAL', cmd: ['npx', 'tsx', 'scripts/elite-tumblr-autopilot.ts', '--force-single'] },
    { name: 'SIEGE_BACKLOG_ATTACK', cmd: ['npx', 'tsx', 'scripts/elite-backlog-attack.ts'] },
    { name: 'GOOGLE_INDEXER', cmd: ['node', 'scripts/google-indexer.js'] }
  ]
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message: string) {
  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
  console.log(`[\x1b[35m${timestamp}\x1b[00m] 🛡️ [WATCHDOG] ${message}`);
}

async function runCycle() {
  log("🚀 Starting Global Dominance Cycle...");

  for (const script of CONFIG.SCRIPTS) {
    try {
      log(`📡 Executing: ${script.name}...`);
      const result = spawnSync(script.cmd[0], script.cmd.slice(1), {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 20 * 60 * 1000,
      });
      const output = `${result.stdout || ''}\n${result.stderr || ''}`;
      // Only log summary
      const lines = output.split('\n');
      const summary = lines.slice(-5).join('\n');
      if (result.status !== 0) {
        log(`❌ Error in ${script.name}: ${summary || 'Unknown error'}`);
      } else {
        console.log(`   └─ Status: ✅ SUCCESS\n${summary}`);
      }
    } catch (err: any) {
      log(`❌ Error in ${script.name}: ${err.message}`);
    }
    
    // Stagger domestic scripts to avoid overlap
    await sleep(5000 + Math.random() * 10000);
  }

  log("🏁 Cycle Complete. Database hydrated & indexed.");
}

async function main() {
  log("🪐 DRKCNAY Elite Watchdog Initialized.");
  log("Mode: 7/24 Autonomous Gigantism.");

  while (true) {
    await runCycle();
    
    const intervalMins = Math.floor(Math.random() * (CONFIG.MAX_INTERVAL_MINS - CONFIG.MIN_INTERVAL_MINS + 1)) + CONFIG.MIN_INTERVAL_MINS;
    log(`💤 Sleeping for ${intervalMins} minutes until next cycle...`);
    
    await sleep(intervalMins * 60 * 1000);
  }
}

main().catch(err => {
  console.error("🔥 FATAL WATCHDOG FAILURE:", err);
  process.exit(1);
});
