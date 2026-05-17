
import { googleAuth } from '../lib/google-auth';
import { google } from 'googleapis';
import * as dotenv from 'dotenv';

dotenv.config();

async function getAuthorizedEmail() {
    console.log("🔓 [GOD MODE] Veritabanından OAuth tokenları deşifre ediliyor...");
    try {
        const client = await googleAuth.getAuthorizedClient();
        
        console.log("📡 Google OAuth2 API'sine istek gönderiliyor...");
        const oauth2 = google.oauth2({ version: 'v2', auth: client });
        
        try {
            const userInfo = await oauth2.userinfo.get();
            console.log("\n🎯 BULUNAN YETKİLİ MAİL HESABI:");
            console.log(`📧 E-Posta: ${userInfo.data.email}`);
            console.log(`👤 İsim: ${userInfo.data.name}`);
            console.log(`🆔 Google ID: ${userInfo.data.id}`);
        } catch (apiErr: any) {
            console.error("❌ Google UserInfo API hatası:", apiErr.message);
            console.log("\n💡 Not: Eğer bu hesap bir 'Servis Hesabı' (Service Account) ise doğrudan bireysel maili olmayabilir.");
            
            // Eğer servis hesabı aktifse onun mailini gösterelim
            if (client.credentials) {
                console.log("ℹ️ Mevcut Kimlik Bilgileri:", client.credentials);
            }
        }
    } catch (e: any) {
        console.error("\n❌ Kimlik yetkilendirmesi başarısız veya veritabanında OAuth kaydı yok:", e.message);
        
        // Eğer veritabanında yoksa, google-key.json içerisindeki servis hesabını gösterelim
        console.log("\n📁 Mevcut Servis Hesabı Maili (google-key.json):");
        try {
            const keyData = require('../google-key.json');
            console.log(`📧 Servis E-Postası: ${keyData.client_email}`);
            console.log(`📂 Project ID: ${keyData.project_id}`);
        } catch {
            console.log("⚠️ google-key.json dosyası okunamadı.");
        }
    }
}

getAuthorizedEmail();
