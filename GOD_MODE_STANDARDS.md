# ⚡ DRKCNAY ELITE: GOD MODE ENGINEERING STANDARDS ⚡

Bu dosya, sistemin "God Mode" statüsünü koruması için Antigravity (AI) tarafından tüm gelecek geliştirmelerde **zorunlu kural** olarak kabul edilmiştir. Yeni bir özellik yazılırken veya refactor yapılırken bu kurallar ASLA atlanamaz.

## 1. Doğal Dil İşleme (NLP): AI Detection Bypass
*   **Perplexity (Nadir Kelimeler):** İçerik üretirken veya Spintax yazarken asla sıradan kelimeler (örn: "kaliteli", "güzel") kullanma. Daima tahmin edilmesi zor, sofistike ve VIP sektöre uygun edebi metaforlar seç (Örn: "ipeklere sarılı mahremiyet", "asfaltın fısıltısı").
*   **Burstiness (Ritim Kaosu):** Sistem cümleleri robot gibi ardışık ve aynı uzunlukta KURAMAZ. 30 kelimelik kompleks ve zarif bir cümlenin hemen arkasına *tek kelimelik* ("Kusursuz.", "Asla.") vurucu cümleler ekleyerek insan zihninin kaotik sıçramalarını simüle et.

## 2. React & Next.js Performans Güvenliği
*   **Passive Event Listeners:** Scroll (kaydırma) ve Mouse (fare) takip dinleyicilerinde tarayıcının render thread'ini kilitlememek için DAİMA `{ passive: true }` parametresini kullan. (Jank Önleme)
*   **Memory Leak Kalkanı:** Bileşenler (Component) içinde kullanılan tüm `setTimeout`, `setInterval` veya `document.body.style` manipülasyonları, bileşen DOM'dan silinirken (`unmount`) kesinlikle bir **Cleanup Function** (örn: `clearTimeout`) ile temizlenecek.
*   **Hydration Error Önleme:** İstemci tarafında (`use client`) `Math.random()` veya `Date.now()` gibi dinamik rastgelelik üreten yapılar kullanılıyorsa, SSR (Sunucu) ile Tarayıcı (Client) arasındaki uyumsuzluğu önlemek için DAİMA `useEffect` ve `isMounted` state'i veya deterministik tohumlar (Seed) kullanılacak.

## 3. Prisma ORM: Sunucu Bellek (RAM) Optimizasyonu
*   **Zero-Waste Queries (Sıfır İsraf):** Veritabanından veri çekerken ASLA `SELECT *` mantığıyla (`findMany()` veya `findFirst()` içerisine `select` yazmadan) devasa nesneler çekme. Sadece ekrana basılacak olan kolonları (Örn: `select: { title: true, content: true }`) çağır.
*   **Hayalet Sorgulara Son:** Sayfa içinde JSX/HTML kısmında kullanılmayan hiçbir veritabanı sorgusu dosyada tutulmayacak. Koddan anında silinecek.
*   **N+1 Koruması:** Döngü içerisinde asla veritabanı sorgusu atma. Daima `include` veya `in: []` ile veriyi tek seferde (JOIN ile) çek.

> **ANTIGRAVITY DİREKTİFİ:** Bu prensipler projenin DNA'sıdır. Sistemin hızını yavaşlatacak, RAM'i şişirecek veya Google SpamBrain'e yakalanacak her türlü geleneksel kod yazımı KESİNLİKLE yasaktır.
