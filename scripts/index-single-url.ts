import { googleAuth } from '../lib/google-auth';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const url = "https://escortvip.net/amp?loc=istanbul";
  console.log(`📡 [INDEXING] Sending force indexing request to Google for: ${url}`);
  
  try {
    const result = await googleAuth.forceIndexUrl(url, 'URL_UPDATED');
    if (result) {
      console.log(`\n🎉 [SUCCESS] Indexing request accepted by Google! Result:`, result);
    } else {
      console.error(`\n❌ [FAILED] Google Indexing API rejected or failed to process the request.`);
    }
  } catch (err: any) {
    console.error(`\n💥 [ERROR] Failed to run indexing:`, err.message);
  }
}

run();
