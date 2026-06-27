import { google } from 'googleapis';
import { googleAuth } from '../lib/google-auth';

async function run() {
  try {
    const auth = await googleAuth.getAuthorizedClient();
    const siteVerification = google.siteVerification({
      version: 'v1',
      auth
    });

    console.log("Listing verified resources...");
    const res = await siteVerification.webResource.list({});
    console.log("Success! Items count:", res.data.items?.length);
    if (res.data.items) {
      for (const item of res.data.items) {
        console.log(`- ${item.site?.identifier} (${item.id}): owners:`, item.owners);
      }
    }
  } catch (err: any) {
    console.error("Error listing site verification resources:", err.message);
  }
}

run();
