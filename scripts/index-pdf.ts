import { googleIndexing } from "../lib/google-indexing";
import dotenv from "dotenv";

dotenv.config();

async function runIndex() {
  const url = "https://istanbulescort.blog/ULTIMATE_VIP_GUIDE_2026.pdf";
  console.log(`📡 [INDEX INITIATION] Requesting indexation for: ${url}`);
  
  try {
    await googleIndexing.broadcast(url);
    console.log("🏁 [INDEX SUCCESS] Broadcast completed successfully!");
  } catch (err: any) {
    console.error("💥 Indexing failed:", err.message);
  }
}

runIndex();
