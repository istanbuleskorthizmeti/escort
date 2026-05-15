# 🛸 ELITE CLUSTER: CORE STATE (AUTONOMOUS ENGINE)

## 📌 Proje Kimliği
- **Alan Adı:** vipescorthizmeti.com
- **Motto:** Elite System v6.0 - God Mode v2.0 (Cybernetic Memory)
- **Dil:** Türkçe (Zorunlu)

## 🏗️ Teknoloji Stack
- **Frontend:** Next.js 16.2.2 & React 19.2.4 (App Router)
- **Styling:** Tailwind CSS v4 (Glassmorphism, Rose-600 accents)
- **Backend:** Go (Golang) v1.22+ (Planlanan)
- **Database:** PostgreSQL & Prisma ORM
- **State:** Zustand
- **AI:** Gemini 3.1 Pro High, DeepSeek, HuggingFace

## 🌐 Altyapı
- **Sunucu IP:** 187.77.***.*** (Production)
- **Konum:** Tüm geliştirme ve build işlemleri bu sunucuda yapılacak.
- **Telegram HQ:** -1003961137983 (Bot: 865670****:AAFJr9QsnY... (Protected))

## 🎯 Güncel Hedefler & Durum (21.04.2026)
1.  **Hafıza Sabitleme:** [TAMAMLANDI] .cursorrules ve GTM_CORE_STATE.md güncellendi.
2.  **God Mode Upgrade:** [TAMAMLANDI] Runes & Skills Workspace oluşturuldu (v2.0).
3.  **Sunucu Stabilizasyonu:** [TAMAMLANDI] Next.js 16 build hataları giderildi, PM2 üzerinden 3000 portu stabilize edildi.
4.  **API Entegrasyonu:** [TAMAMLANDI] Gemini, Bitly V4, Blogger ve Tumblr OAuth sistemleri otonom hale getirildi.
5.  **SEO Dominance Engine:** [TAMAMLANDI] DRKCNAY Elite Engine v2.0 (Hydra Network) yayına alındı.
6.  **Admin Command Center:** [TAMAMLANDI] `/admin/seo/tumblr` ve otonom hidratasyon paneli aktif.
7.  **Enriched Telemetry:** [TAMAMLANDI] Telegram üzerinden sistem sağlığı ve detaylı SEO raporlaması aktif.

## 🚨 Kritik Protokoller
- **.env Güvenliği:** Sunucudaki .env dosyası asla SSH `cat <<EOF` veya `printf` ile yazılmamalıdır (şŞifreli karakterlerin bozulması sebebiyle). Daima yerel `.env.production` dosyası oluşturulup `scp` ile aktarılmalıdır.
- **SEO Motoru:** `lib/ai-provider.ts` üzerinden çalışır. Gemini native hata verirse otomatik olarak `gtm-backend` (Port 8080) fallback'ini kullanır.
- **Lokasyonlar:** `lib/locations-registry` altındadır.
- **Build:** Sunucuda `npx prisma generate && npm run build` sırasıyla çalıştırılmalıdır.
