import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// .env dosyasını yükle
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const CF_API_TOKEN = process.env.CF_API_TOKEN;
const CF_EMAIL = process.env.CF_EMAIL;

const OLD_DOMAIN = 'istanbulescort.blog';
const NEW_DOMAIN = 'istanbulescort.blog';

async function setupCloudflareRedirect() {
  if (!CF_API_TOKEN) {
    console.error("❌ HATA: .env dosyasında CF_API_TOKEN bulunamadı.");
    return;
  }

  const headers = {
    'Authorization': `Bearer ${CF_API_TOKEN}`,
    'X-Auth-Email': CF_EMAIL,
    'Content-Type': 'application/json'
  };

  try {
    console.log(`🔍 [1/3] ${OLD_DOMAIN} için Cloudflare Zone ID aranıyor...`);
    const zonesRes = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${OLD_DOMAIN}`, { headers });
    
    if (zonesRes.data.result.length === 0) {
      console.error(`❌ Zone bulunamadı: ${OLD_DOMAIN}. Cloudflare hesabınızda bu alan adı kayıtlı değil veya yetkiniz yok.`);
      return;
    }
    
    const zoneId = zonesRes.data.result[0].id;
    console.log(`✅ Zone ID bulundu: ${zoneId}`);

    console.log(`🚀 [2/3] 301 Page Rule oluşturuluyor (Hedef: ${NEW_DOMAIN})...`);
    
    // Page Rule Yükü (Payload)
    // *istanbulescort.blog/* şeklindeki kural:
    // $1 = subdomain (örn: www.)
    // $2 = path (örn: /istanbul-escort)
    const rulePayload = {
      targets: [
        {
          target: "url",
          constraint: {
            operator: "matches",
            value: `*${OLD_DOMAIN}/*`
          }
        }
      ],
      actions: [
        {
          id: "forwarding_url",
          value: {
            url: `https://${NEW_DOMAIN}/$2`,
            status_code: 301
          }
        }
      ],
      priority: 1,
      status: "active"
    };

    // Mevcut kuralları kontrol et (Çift kuralı engellemek için)
    const existingRules = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`, { headers });
    const isDuplicate = existingRules.data.result.some(rule => 
      rule.actions.some(a => a.id === "forwarding_url" && a.value.url.includes(NEW_DOMAIN))
    );

    if (isDuplicate) {
      console.log(`⚠️ Bu yönlendirme Cloudflare'de zaten kurulu! İşlem atlanıyor.`);
      return;
    }

    // Page Rule'u Gönder
    const createRes = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zoneId}/pagerules`, rulePayload, { headers });
    
    if (createRes.data.success) {
      console.log(`🔥 [3/3] BAŞARILI! Tüm trafik Edge üzerinden ${OLD_DOMAIN} -> ${NEW_DOMAIN} olarak 301 ile yönlendirildi.`);
      console.log('Googlebot artık sitene gelmeden doğrudan Cloudflare sunucularından 301 kodunu alacak. Bu SEO için en hızlı yöntemdir!');
    }

  } catch (error) {
    console.error("❌ Hata oluştu:");
    console.error(error.response?.data?.errors || error.message);
  }
}

setupCloudflareRedirect();
