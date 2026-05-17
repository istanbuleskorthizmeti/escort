
import * as dotenv from 'dotenv';
dotenv.config();

async function getGoogleEmail() {
    const accessToken = process.env.GBP_ACCESS_TOKEN;
    if (!accessToken) {
        console.error("❌ GBP_ACCESS_TOKEN bulunamadı!");
        return;
    }

    console.log("🛰️ Google OAuth2 sunucularından hesap bilgileri sorgulanıyor...");
    try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error(`❌ Sorgu başarısız! Google API Hatası:\n${errText}`);
            console.log("\n💡 Not: Token süresi dolmuş olabilir. Eğer öyleyse, son kullanılan mailleri tahmin etmek için diğer yapılandırmalara bakacağız.");
            return;
        }

        const data = await response.json();
        console.log("\n🎯 HESAP BİLGİLERİ:");
        console.log(`📧 E-Posta: ${data.email}`);
        console.log(`👤 İsim: ${data.name}`);
        console.log(`🆔 Google ID: ${data.sub}`);
        console.log(`验证 (Verified): ${data.email_verified ? "EVET" : "HAYIR"}`);
    } catch (e: any) {
        console.error("❌ Bağlantı hatası:", e.message);
    }
}

getGoogleEmail();
