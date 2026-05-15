# 🔱 GOD MODE ARCHITECTURE REPORT — DRKCNAY NETWORK

**Tarih:** 2025-04-09  
**Analiz Seviyesi:** Senior Full-Stack + Cyber Security  
**Kod Tabanı:** Next.js 15 + Prisma + PostgreSQL + AI Orchestrator

---

## 🚀 PERFORMANS DARBOĞAZLARI

### 1. Caching & Revalidation
| Sorun | Risk | Çözüm |
|-------|------|-------|
| `unstable_cache` kullanılıyor (Next.js 15'te hala deneysel) | Cache invalidation tutarsızlığı, üretimde beklenmedik hatalar | `await fetch(url, { next: { revalidate: 3600 } })` veya `use cache` direktifi (Next 15+) |
| `getHybridProfiles` cache tag sadece `['profiles']` kullanıyor | Tüm profiller aynı tag altında, segmentli invalidation yok | `tags: ['profiles', `city:${city}`, `district:${district}`]` |
| `revalidate: 3600` tüm sayfada kullanılıyor | Ziyaretçi eski içerik görebilir, canlı değişiklikler geç yansır | ISR + on-demand revalidation (`revalidatePath`) ile kombinasyon |

### 2. Veritabanı Sorguları
| Sorun | Risk | Çözüm |
|-------|------|-------|
| `getVitrinProfiles()` her sayfa yüklemesinde tüm aktif profilleri çeker | Büyük veride bellek + gecikme, sayfa başına gereksiz yük | Sayfalama + sadece ilgili şehir/ilçe filtresi eklenmeli |
| `getPageContent` iki kez çağrılıyor ve her biri ayrı sorgu | N+1 benzeri durum, iki round trip | `prisma.pageContent.findMany({ where: { slug: { in: [slug1, slug2] }, ... } })` tek sorguda |
| `checkPrismaConnection` sorgusu her sağlık kontrolünde `SELECT 1` | Gereksiz yük, bağlantı havuzu tüketimi | `prisma.$queryRawUnsafe` veya health check'i middleware'de throttle |

### 3. Next.js Rendering & Streaming
| Sorun | Risk | Çözüm |
|-------|------|-------|
| `StreamingSEOContent` Suspense ile sarılmış ancak içte `generateGodModeContent` AI çağrısı yapıyor (3-5 saniye) | Kullanıcıya boş placeholder gösterilir, TTFB artar | AI içeriğini edge worker veya background job'a taşı, sadece önbellek kırıldığında tetikle |
| `IstanbulConquestMatrix` ve diğer componentler ayrı Suspense'lerde | Paralel yüklenme yok, waterfall oluşur | Tek bir `Suspense` altında topla veya streaming'e uygun hale getir |
| `dynamicParams = true` ve `generateStaticParams` yok | Her yeni şehir/ilçe kombinasyonu ilk ziyarette SSR bekler | Dinamik segmente pre-render ekle (popüler 100 kombinasyon) veya Edge caching kullan |

---

## 🛡️ GÜVENLİK AÇIKLARI

### 1. Content Security Policy (CSP) & Header Zafiyetleri
| Sorun | Risk | Çözüm |
|-------|------|-------|
| `frame-ancestors *` + `X-Frame-Options: ALLOWALL` | Clickjacking saldırılarına açık | `frame-ancestors 'self'` veya sadece güvenilen domainler |
| `Access-Control-Allow-Origin: *` + `Access-Control-Allow-Methods: GET, OPTIONS` | Herhangi bir site kaynağınıza AJAX ile erişebilir (CSRF değil ama veri sızıntısı) | Dynamic origin kontrolü (referrer ile kısıtlama) |
| CSP header'ı eksik (`script-src`, `style-src` vs.) | XSS saldırıları enjekte edilen scriptleri çalıştırabilir | Sıkı bir CSP politikası ekleyin: `default-src 'self'; script-src 'self' 'unsafe-inline'?` |

### 2. XSS & HTML Injection
| Sorun | Risk | Çözüm |
|-------|------|-------|
| `SecureHTML` component kullanılıyor ancak `dangerouslySetInnerHTML` ile JSON-LD schema enjekte ediliyor | Kullanıcı kontrollü içerik (ör: `title`) buraya girerse XSS | `sanitizeDisplayName` sadece başlıkta, JSON içeriği de escape edilmeli. JSON-LD için `next/script` type="application/ld+json" kullanın |
| `SEOContentEngine` içinde muhtemelen HTML string oluşturuluyor | AI tarafından üretilen içerik doğrudan DOM'a basılırsa XSS | AI çıktısını DOMPurify ile filtreleyin veya Markdown render kullanın |

### 3. API Key & Credential Sızıntısı
| Sorun | Risk | Çözüm |
|-------|------|------|
| Google API key, OpenAI key, DeepSeek key string olarak env'de, hata loglarında görünebilir | Log yönetimi zayıfsa key'ler dışarı sızabilir | `process.env.*` okumadan önce maskelenmeli, loglara sadece son 4 karakter yazılmalı |
| API key rotation mekanizması var ama rate-limit sonrası bekleme (30sn) zayıf | Kullanıcı deneyimini bozar, bot tespitine yol açar | Exponential backoff + Redis ile token bucket kullanın |

### 4. Cloaking & URL Manipülasyonu
| Sorun | Risk | Çözüm |
|-------|------|------|
| `rewrites` ile sport-cloaker: `host` regex ile belirli anahtar kelimeleri tespit edip farklı sayfa döndürüyor | Google botları tespit ederse domain banlanır | Bu teknik riskli, alternatif olarak split-testing (A/B) kullanın |
| URL zehirlemesi (`/ilan/:city-rus-eskort-ilanlari-:id.webp`) | Backlink gücü düşürme, spam olarak işaretlenme | Keyword stuffing her zaman cezalandırılır, doğal URL yapısına geçin |

---

## 🔍 SEO VE İNDEKLENME

### 1. Metadata & Title
| Sorun | Risk | Çözüm |
|-------|------|------|
| `generateMetadata` içinde emoji (`🔞`) ve büyük harf kullanımı | Google title'da emoji göstermez veya clickbait algısı | Başlıkta sadece metin, emoji’yi description’a taşıyın |
| `customTitle` dinamik ama varsayılan fallback metadata yok | Bot `og:title` bulamaz, düşük CTR | `generateMetadata` her durumda bir title döndürmeli (`landmarkObj` vs. için) |
| Metadata çoğaltma: sayfada hem `generateMetadata` hem de `script` ile JSON-LD var | Google ikisini karşılaştırır, hata verebilir | JSON-LD title ve description metadata ile uyumlu olmalı |

### 2. SSR & Rendering
| Sorun | Risk | Çözüm |
|-------|------|------|
| `revalidate = 3600` + dynamic routes | Sayfa tamamen statik değil, her 1 saatte bir SSR tetiklenir | `generateStaticParams` ile popüler sayfalar static, gerisi ISR |
| `Suspense` içindeki streaming içerik AI tarafından üretiliyor | Google bot streaming içeriği indexleyemez, içerik boş görünür | AI içeriğini SSR ile dahil edin (zaman aşımına duyarlı) veya bot için statik sürüm |

### 3. Sitemap & Robots.txt
| Sorun | Risk | Çözüm |
|-------|------|------|
| `/robots.txt` ve `/sitemap.xml` API route'ları üzerinden dinamik sunuluyor | Bot'lar her istekte API'yi çağırır, gereksiz yük | Statik dosya oluşturup build sırasında veya cron ile güncelleyin |
| Sitemap sadece `host` parametresi ile değişiyor | Her domain için ayrı sitemap gerekir, botlar sitemap.xml'i okurken redirect yaşar | Domain bazlı routing yerine ana domain altında alt domain sitemap kullanın |

### 4. Bot & User-Agent Yönetimi
| Sorun | Risk | Çözüm |
|-------|------|------|
| Cloaking (sport-cloaker rewrites) | Google Manual Action riski | User-Agent bazlı değil, herkese aynı içeriği sunun |
| `poweredByHeader: false` iyi ama `distDir` değişken | Güvenlik açısından yetersiz, header'da Next.js versiyonu sızmıyor | Tamamdır, ek önlem gerekmez |

---

## 🏗️ MİMARİ TAVSİYELER

### 1. DRY & Kod Tekrarı
| Sorun | Öneri |
|-------|-------|
| Page component'ı içinde `generateMetadata` ile `default export` arasında aynı city/district parsing ve DB sorguları tekrarlanıyor | Shared `useCityDistrict` hook veya `getPageData` fonksiyonu oluşturun, iki yerde de çağırın |
| `sanitizeDisplayName` kullanımı çok sayıda yerde | Tek bir yardımcı fonksiyon, tüm string formatlamaları buradan geçsin |

### 2. Clean Code & Sorumluluklar
| Sorun | Öneri |
|-------|-------|
| `DistrictHubPage` çok fazla sorumluluk: metadata, veri çekme, rendering, SEO, AI | Component parçalara ayrılmalı: `DataLayer`, `SEOLayer`, `UILayer` |
| `OmniAIOrchestrator` çok büyük, test edilebilirliği zor | Provider'ları tek bir interface altında topla, mock test yaz |

### 3. Scalability & Performans
| Sorun | Öneri |
|-------|-------|
| Prisma client her sayfada yeniden oluşturulmuyor (global singleton) | ✅ İyi, ancak `checkPrismaConnection` her health check'te yeni bağlantı açar | Sağlık kontrolünü middleware'de throttle (saniyede 1 istek) |
| Redis gibi bir cache layer yok, unstable_cache Next.js memory ile sınırlı | Yüksek trafikte memory taşması | Redis/Memcached ekleyin, özellikle AI sonuçları için |
| AI provider fallback zinciri: tüm provider'lar aynı anda çalışıyor (try-catch ile) | İlk provider başarısız olursa gecikme artar | Paralel çağrı (race) yapın, en hızlı cevabı kullanın |

### 4. Monolitik Schema Sorunları
| Sorun | Öneri |
|-------|-------|
| `PageContent` modelinde her sosyal platform için ayrı kolonlar (`isBloggerPosted`, `tumblrPostUrl` vs.) | JSON alanına dönüştürün veya ilgili tablolara ayırın (SocialPost) |
| `BotAccount` modelinde `authPayload` string olarak saklanıyor | Güvenlik riski: encrypt edilmiş JSON veya ayrı credentials tablosu |

---

## 📋 CHEAT SHEET — HIZLI AKSİYON KONTROL LİSTESİ

| Kategori | Öncelik | Yapılacak İşlem | Etki |
|----------|---------|-----------------|------|
| ⚡ PERFORMANS | Yüksek | Redis ekleyerek unstable_cache'i replace et | Cache tutarlılığı + memory sınırı kalkar |
| ⚡ PERFORMANS | Yüksek | `getPageContent` sorgularını tek `findMany`'e indirge | DB yükü %50 azalır |
| ⚡ PERFORMANS | Orta | AI içeriğini background job'a taşı, SSR'da sadece önbellekli içerik sun | TTFB 3-5sn → 300ms |
| 🛡️ GÜVENLİK | Yüksek | CSP header'ına `default-src 'self'; script-src 'self'` ekle | XSS açığı kapanır |
| 🛡️ GÜVENLİK | Yüksek | `frame-ancestors` değerini `'self'` yap | Clickjacking önlenir |
| 🛡️ GÜVENLİK | Yüksek | API key'leri log'da maskelenmeli | Sızıntı riski azalır |
| 🛡️ GÜVENLİK | Orta | Cloaking rewrites'ları kaldır veya A/B test'e çevir | Google cezası riski ortadan kalkar |
| 🔍 SEO | Yüksek | `generateMetadata` içinde fallback title/description ekle | Eksik metadata hatası gider |
| 🔍 SEO | Orta | Sitemap.xml'i statik dosyaya çevir, her domain için ayrı sitemap | Bot yükü azalır, indexleme hızlanır |
| 🔍 SEO | Orta | Streaming içeriği bot için static olarak sun (middleware ile) | İçerik indexlenir |
| 🏗️ MİMARİ | Yüksek | Page component'ı sorumluluklarına ayır: `usePageData`, `SEOHead`, `DistrictPageUI` | Bakım kolaylığı artar |
| 🏗️ MİMARİ | Yüksek | `OmniAIOrchestrator`'da paralel race implementasyon | AI yanıt süresi iyileşir |
| 🏗️ MİMARİ | Orta | Prisma connection pool boyutunu ayarla (`connection_limit` env) | Yüksek trafikte bağlantı patlaması önlenir |

---

## 🔚 SONUÇ

Kod tabanı **ileri düzeyde optimizasyon ve güvenlik farkındalığı** ile yazılmış ancak bazı kritik alanlarda riskler var:

- **En kritik güvenlik açığı:** CSP eksikliği + clickjacking. Hemen düzeltilmeli.
- **En büyük performans kazancı:** Redis cache katmanı ve DB sorgu birleştirme.
- **SEO açısından en büyük risk:** Cloaking (sport-cloaker) — Google cezalandırması an meselesi.
- **Mimari olarak en önemli iyileştirme:** Sorumlulukların ayrıştırılması ve test edilebilir yapı.

**Genel Puan:** 7.5/10 — God Mode potansiyeli yüksek, ancak birkaç tweak ile 10/10 olabilir. Özellikle güvenlik ve cloaking konularında hızlı aksiyon alınmalı.

---

**Raporu hazırlayan:** Senior Full-Stack Architect & Cyber Security Uzmanı (God Mode)