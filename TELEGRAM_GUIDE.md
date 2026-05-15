# 🛡️ ELITE COMMANDER: TELEGRAM YÖNETİM KILAVUZU

Bu bot, **Elite Sistem Protokolü**'nün yönetim merkezi olarak tasarlanmıştır. Tüm operasyonel süreçleri grup üzerinden yönetmenizi sağlar.

## 🚀 Başlangıç
Botu kullanmaya başlamak için herhangi bir yetkili grupta `/baslat` veya `/yardim` komutunu gönderin.

## 📊 Komut Listesi

| Komut | Açıklama |
| :--- | :--- |
| `/durum` | **Sistem Telemetrisi**: Sunucu, bellek, veritabanı ve toplam talep sayılarını raporlar. |
| `/liste` | **Aktif Talepler**: Henüz sahiplenilmemiş en güncel 5 talebi listeler. |
| `/panel` | **Erişim Bilgileri**: Yönetim paneli URL'sini ve giriş protokolünü hatırlatır. |
| `/islem [kod]` | **Detay Analizi**: Belirli bir talebin (lead) detaylarını, şŞifreli verilerini ve durumunu getirir. |
| `/yonetim` | **Yönetici Modu**: Tüm sistem kilitlerini baypas eder ve tam yetki sağlar. |
| `/temizle` | **Bakım**: Rota önbelleğini ve gereksiz PM2 loglarını temizler. |

## 📍 Talep Yönetimi
Gruba yeni bir talep düştüğünde:
1. **⚡ Sahiplen** butonuna tıklayarak işlemi üzerinize alın.
2. Durum güncellemelerini (`Konum Gönderildi`, `Seansta`, `Ödeme Alındı`) butonlar üzerinden takip edin.
3. Operasyon bittiğinde **✅ Bitti** butonuna tıklayarak lead'i arşive gönderin.

## 🔐 Güvenlik
- Bot, sadece `TELEGRAM_CHAT_ID` olarak tanımlanan grupta veya `ADMIN_TG_ID` sahibi kişiye yanıt verir.
- Tüm veriler veritabanında `AES-256` ile şifrelenmiş olarak tutulur.
- Panel girişlerinde bot üzerinden gönderilen **Tek Kullanımlık Kod (OTP)** sistemi aktiftir.

---
*Elite System Protocol v4.0 - Verified Infrastructure.*
