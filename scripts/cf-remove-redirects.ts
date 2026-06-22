import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;

const DOMAINS_TO_CLEAN = ['vipescorthizmeti.com', 'escortvip.net'];

async function cleanCloudflareRedirects() {
  if (!CF_API_TOKEN) {
    console.error("❌ HATA: .env dosyasında CF_API_TOKEN bulunamadı.");
    return;
  }

  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  for (const domain of DOMAINS_TO_CLEAN) {
    console.log(`\n🔍 [CLEAN] Processing domain: ${domain}`);
    try {
      // 1. Get Zone ID
      const zonesRes = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${domain}`, { headers });
      if (zonesRes.data.result.length === 0) {
        console.warn(`⚠️ Zone ID not found for ${domain}. Skipping...`);
        continue;
      }
      const zoneId = zonesRes.data.result[0].id;
      console.log(`✅ Zone ID: ${zoneId}`);

      // 2. Remove Dynamic Redirects
      try {
        console.log(`🚀 Checking for Dynamic Redirect rulesets...`);
        const rulesetRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_dynamic_redirect/entrypoint`, { headers });
        if (rulesetRes.data && rulesetRes.data.result) {
          const rulesetId = rulesetRes.data.result.id;
          const existingRules = rulesetRes.data.result.rules || [];
          console.log(`   Found ruleset ${rulesetId} with ${existingRules.length} rules.`);

          // Filter out redirect rules pointing to istanbulescort.blog
          const cleanRules = existingRules.filter((rule: any) => {
            const isTargetRedirect = rule.action === 'redirect' && 
              (JSON.stringify(rule.action_parameters)?.includes('istanbulescort.blog') || rule.description?.toLowerCase().includes('redirect'));
            return !isTargetRedirect;
          });

          if (cleanRules.length !== existingRules.length) {
            console.log(`   Removing redirect rules from ruleset...`);
            await axios.put(
              `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${rulesetId}`,
              { rules: cleanRules },
              { headers }
            );
            console.log(`   ✅ Dynamic Redirects cleaned for ${domain}.`);
          } else {
            console.log(`   No matching Dynamic Redirect rules found.`);
          }
        }
      } catch (err: any) {
        console.log(`   ℹ️ No Dynamic Redirect ruleset entrypoint or failed to read:`, err.response?.data || err.message);
      }

      // 3. Remove Page Rules
      try {
        console.log(`🚀 Checking for Page Rules...`);
        const pagerulesRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`, { headers });
        const rules = pagerulesRes.data.result || [];
        console.log(`   Found ${rules.length} Page Rules.`);

        for (const rule of rules) {
          const isRedirectRule = rule.actions.some((action: any) => action.id === 'forwarding_url');
          if (isRedirectRule) {
            console.log(`   Deleting redirect Page Rule [ID: ${rule.id}]...`);
            await axios.delete(`https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules/${rule.id}`, { headers });
            console.log(`   ✅ Page Rule deleted.`);
          }
        }
      } catch (err: any) {
        console.error(`   ❌ Failed checking/deleting Page Rules:`, err.response?.data || err.message);
      }

    } catch (e: any) {
      console.error(`❌ Failed processing ${domain}:`, e.response?.data || e.message);
    }
  }
  console.log("\n🏆 Cloudflare clean-up completed.");
}

cleanCloudflareRedirects();
