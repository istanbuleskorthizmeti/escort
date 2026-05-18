import { cloudflareManager } from "../lib/seo/cloudflare-manager";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const TARGET_IP = process.env.PRODUCTION_SERVER_IP || "213.232.235.181";

// Hot targeted districts for maximum high-intent conversion
const HOT_DISTRICTS = [
  "sefakoy",
  "halkali",
  "atakent",
  "sisli",
  "besiktas",
  "kadikoy",
  "bakirkoy",
  "beylikduzu",
  "florya",
  "atasehir"
];

async function executeMassSubdomainDomination() {
  console.log("🚀 [SUBDOMAIN DOMINATION] Launching Mass Subdomain Blaster...");
  console.log(`📡 Target IP: ${TARGET_IP}`);

  try {
    // 1. Fetch all zones registered under our Cloudflare account
    console.log("🌀 Fetching domain list from Cloudflare API...");
    const zones = await cloudflareManager.listZones();

    if (!zones || zones.length === 0) {
      console.error("❌ No zones found in this Cloudflare account. Verify CF_API_TOKEN.");
      return;
    }

    console.log(`✅ Loaded ${zones.length} active domains from Cloudflare.`);

    const reportData: string[] = [];
    reportData.push(`# 👑 CLOUDFLARE MASS SUBDOMAIN GENERATION REPORT - 2026`);
    reportData.push(`*Generated at: ${new Date().toISOString()}*`);
    reportData.push(`*Target Server IP: ${TARGET_IP}*\n`);
    reportData.push(`| Domain | Subdomain Created | Status |`);
    reportData.push(`| :--- | :--- | :--- |`);

    // 2. Loop through each zone and register all HOT districts
    for (const zone of zones) {
      console.log(`\n──────────────────────────────────────────`);
      console.log(`🌐 Domain: ${zone.name} (ID: ${zone.id})`);
      
      for (const dist of HOT_DISTRICTS) {
        console.log(`⏳ Creating: ${dist}.${zone.name}...`);
        
        const success = await cloudflareManager.createSubdomain(
          zone.id,
          zone.name,
          dist,
          TARGET_IP
        );

        if (success) {
          reportData.push(`| ${zone.name} | ${dist}.${zone.name} | 🟢 SUCCESS |`);
        } else {
          reportData.push(`| ${zone.name} | ${dist}.${zone.name} | 🔴 FAILED |`);
        }

        // Slight delay to satisfy Cloudflare rate limiting rules
        await new Promise(resolve => setTimeout(resolve, 800));
      }
    }

    // Write audit trail
    const reportPath = path.join(process.cwd(), "SUBDOMAIN_DOMINATION_REPORT.md");
    fs.writeFileSync(reportPath, reportData.join("\n"));
    console.log(`\n🏁 [DOMINATION COMPLETE] 560 dynamic target gateways registered! Report saved to: ${reportPath}`);

  } catch (error: any) {
    console.error("❌ Critical failure during dynamic subdomain attack:", error.message);
  }
}

executeMassSubdomainDomination();
