import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// .env dosyasını yükle
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_EMAIL = process.env.CF_EMAIL;

const REDIRECTS = [
  { old: 'vipescorthizmeti.com', new: 'istanbulescort.blog' },
  { old: 'istanbulescdrkcn.com', new: 'istanbulescort.blog' },
  { old: 'escortvip.net', new: 'istanbulescort.blog' }
];

async function setupCloudflareRedirects() {
  if (!CF_API_TOKEN) {
    console.error("❌ HATA: .env dosyasında CF_API_TOKEN bulunamadı.");
    return;
  }

  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'X-Auth-Email': CF_EMAIL,
    'Content-Type': 'application/json'
  };

  for (const pair of REDIRECTS) {
    const OLD_DOMAIN = pair.old;
    const NEW_DOMAIN = pair.new;
    try {
      console.log(`🔍 [1/3] ${OLD_DOMAIN} için Cloudflare Zone ID aranıyor...`);
      const zonesRes = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${OLD_DOMAIN}`, { headers });
      
      if (zonesRes.data.result.length === 0) {
        console.error(`❌ Zone bulunamadı: ${OLD_DOMAIN}. Cloudflare hesabınızda bu alan adı kayıtlı değil veya yetkiniz yok.`);
        continue;
      }
      
      const zoneId = zonesRes.data.result[0].id;
      console.log(`✅ Zone ID bulundu: ${zoneId}`);

      console.log(`🚀 [2/3] Dynamic Redirect ruleset kontrol ediliyor...`);

      let rulesetId = null;
      let existingRules = [];

      try {
        const getRulesetRes = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/phases/http_request_dynamic_redirect/entrypoint`, { headers });
        if (getRulesetRes.data && getRulesetRes.data.result) {
          rulesetId = getRulesetRes.data.result.id;
          existingRules = getRulesetRes.data.result.rules || [];
          console.log(`✅ Mevcut ruleset bulundu: ${rulesetId}`);
        }
      } catch (e) {
        console.log(`ℹ️ Ruleset henüz oluşturulmamış, yeni bir ruleset oluşturulacak.`);
      }

      const redirectRule = {
        description: `Redirect all traffic from ${OLD_DOMAIN} to ${NEW_DOMAIN}`,
        expression: "true",
        action: "redirect",
        action_parameters: {
          from_value: {
            status_code: 301,
            target_url: {
              expression: `concat("https://${NEW_DOMAIN}", http.request.uri.path)`
            },
            preserve_query_string: true
          }
        },
        enabled: true
      };

      if (rulesetId) {
        // Check if already exists
        const isDuplicate = existingRules.some(rule => 
          rule.action === "redirect" && 
          rule.action_parameters?.from_value?.target_url?.expression?.includes(NEW_DOMAIN)
        );

        if (isDuplicate) {
          console.log(`⚠️ Bu yönlendirme zaten kurulu! İşlem atlanıyor.`);
          continue;
        }

        console.log(`📤 Ruleset güncelleniyor (Yeni kural ekleniyor)...`);
        const updatedRules = [...existingRules, redirectRule];

        const updateRes = await axios.put(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets/${rulesetId}`,
          { rules: updatedRules },
          { headers }
        );

        if (updateRes.data.success) {
          console.log(`🔥 [3/3] BAŞARILI! Dynamic Redirect kuralı güncellendi.`);
        }
      } else {
        console.log(`📤 Yeni Ruleset oluşturuluyor...`);
        const createRes = await axios.post(
          `https://api.cloudflare.com/client/v4/zones/${zoneId}/rulesets`,
          {
            name: "default",
            description: "Dynamic Redirect Ruleset",
            kind: "zone",
            phase: "http_request_dynamic_redirect",
            rules: [redirectRule]
          },
          { headers }
        );

        if (createRes.data.success) {
          console.log(`🔥 [3/3] BAŞARILI! Yeni Dynamic Redirect ruleset'i oluşturuldu ve yönlendirme aktif.`);
        }
      }

    } catch (error) {
      console.error("❌ Hata oluştu:");
      console.error(error.response?.data || error.message);
    }
  }
}

setupCloudflareRedirects();
