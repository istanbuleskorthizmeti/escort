import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import Script from "next/script";
import { getSiteId } from "@/lib/site-context";
import { ThemeEngine } from "@/lib/theme-engine";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair', 
  display: 'swap',
  weight: ['700', '900'],
  style: ['normal', 'italic']
});
import { BrowserIntelligence } from "@/components/SEO/BrowserIntelligence";
import { LocalAuthority } from "@/components/SEO/LocalAuthority";
import { toTitleCaseTR } from "@/lib/utils";
import { MobileAppBanner } from "@/components/UI/MobileAppBanner";

export async function generateViewport(): Promise<Viewport> {
  let host = siteConfig.domain;
  try {
    const h = await headers();
    host = h.get("host") || siteConfig.domain;
  } catch (e) {}
  
  const theme = ThemeEngine.getTheme(host);
  return {
    themeColor: theme.primaryColor || "#e11d48",
    width: "device-width",
    initialScale: 1,
  };
}


export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  let host = siteConfig.domain;
  try {
    const h = await headers();
    host = h.get("host") || siteConfig.domain;
  } catch (e) {}
  
  const theme = ThemeEngine.getTheme(host);
  const brandTitle = toTitleCaseTR(theme.brandName);
  const isFlagship = host.includes('dorukcanay.digital');
  const title = isFlagship 
    ? `💎 ${brandTitle} | Elite & Luxury VIP Companion Rehberi`
    : `🔞 ${brandTitle} | %100 Gerçek ve Vahşi Escort İlanları`;
    
  const description = isFlagship
    ? `${brandTitle}: İstanbul'un en seçkin ve lüks partner rehberi. ${theme.slogan}. Kaporasız, stüdyo onaylı modeller ile VIP escort deneyimi.`
    : `${brandTitle}: İstanbul'un en hiddetli escort rehberi. ${theme.slogan}. Kaporasız, gerçek ve sınırsız escort bayanlar ile VIP deneyim.`;

  return {
    title,
    description,
    manifest: "/manifest.json",
    metadataBase: new URL(`https://${host}`),
    alternates: { canonical: "/", languages: { 'tr-TR': '/' } },
    openGraph: {
      title,
      description,
      url: `https://${host}`,
      siteName: brandTitle,
      locale: "tr_TR",
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `DRKCNAY ELITE - ${brandTitle}`,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
    other: {
      'google': 'notranslate',
      'apple-itunes-app': 'app-id=1642893041, app-argument=https://istanbulescort.blog',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'format-detection': 'telephone=no',
      'whatsapp-visibility': 'high-intent-escort',
      'drkcnay-protocol': 'elite-v16',
    },
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let host = siteConfig.domain;
  let lang = "tr";
  try {
    const h = await headers();
    host = h.get("host") || siteConfig.domain;
    const acceptLanguage = h.get("accept-language") || "";
    const primaryLang = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
    if (["tr", "en", "ru", "de", "ar"].includes(primaryLang)) {
      lang = primaryLang;
    }
  } catch (e) {}
  
  const theme = ThemeEngine.getTheme(host);
  const brandTitle = toTitleCaseTR(theme.brandName);
  
  const cleanHost = host.replace(/^www\./, '').toLowerCase();
  const gaId = ({
    'istanbulescort.blog': 'G-5N1LVB5EWE',
    'escortvip.net': 'G-HL8P9QQDSV',
    'dorukcanay.digital': 'G-1KYYJ5TD5Z',
    'vipescorthizmeti.shop': 'G-5N1LVB5EWE'
  } as Record<string, string>)[cleanHost] || '';

  return (
    <html lang={lang} className={`h-full antialiased ${inter.variable} ${outfit.variable} ${playfair.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-inter: var(--font-inter), sans-serif;
            --font-playfair: var(--font-playfair), serif;
            --font-outfit: var(--font-outfit), sans-serif;
            --primary-color: ${theme.primaryColor};
            --secondary-color: ${theme.secondaryColor};
            --bg-color: ${theme.bgColor};
            --text-color: ${theme.textColor};
            --heading-font: ${theme.headingFont};
            --body-font: ${theme.bodyFont};
          }
          body { 
            background-color: var(--bg-color); 
            color: var(--text-color);
            font-family: var(--body-font);
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--heading-font);
          }
          .glass-card {
             background: #09090b;
             border: 1px solid #18181b;
          }
          .text-primary { color: var(--primary-color); }
          .bg-primary { background-color: var(--primary-color); }
          .border-primary { border-color: var(--primary-color); }
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `https://${host}/#website`,
                  "name": `${brandTitle} | VIP ESCORT`,
                  "url": `https://${host}`,
                  "publisher": { "@id": `https://${host}/#organization` }
                },
                {
                  "@type": "Organization",
                  "@id": `https://${host}/#organization`,
                  "name": `${brandTitle} ELITE NETWORK`,
                  "url": `https://${host}`,
                  "logo": `https://${host}/og-image.jpg`,
                  "sameAs": ["https://github.com/drkcnay/rest"]
                },
                {
                  "@type": "LocalBusiness",
                  "@id": `https://${host}/#business`,
                  "name": `${brandTitle} AJANSI`,
                  "description": `${brandTitle}: İstanbul genelinde kaporasız ve %100 gerçek escort bayan hizmetleri.`,
                  "image": `https://${host}/og-image.jpg`,
                  "url": `https://${host}`,
                  "telephone": "+12495448982",
                  "priceRange": "₺₺₺",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Istanbul",
                    "addressCountry": "TR"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `https://${host}/#app`,
                  "name": `${brandTitle} VIP Companion App`,
                  "operatingSystem": "iOS, Android",
                  "applicationCategory": "LifestyleApplication",
                  "downloadUrl": `https://${host}/download-app`,
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "TRY"
                  }
                }
              ]
            })
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if (typeof document === 'undefined') return;
            var ref = document.referrer || '';
            var host = window.location.hostname;
            
            // Check if referrer is from a Google domain
            var isGoogle = /google\\.(com|co|com?\\.[a-z]{2})$/i.test(ref) || ref.indexOf('google.com') !== -1;
            var isLocal = host === 'localhost' || host.indexOf('127.0.0.1') !== -1;
            var isAmpCache = host.indexOf('ampproject.org') !== -1;
            
            // Safety: do not redirect search crawlers or lighthouse audits
            var ua = navigator.userAgent.toLowerCase();
            var isBot = /bot|crawler|spider|robot|lighthouse|google|yandex|bing|baidu/i.test(ua);
            
            if (isGoogle && !isLocal && !isAmpCache && !isBot) {
              var check = function() {
                var ampLink = document.querySelector('link[rel="amphtml"]');
                if (ampLink && ampLink.href) {
                  try {
                    var parser = document.createElement('a');
                    parser.href = ampLink.href;
                    var cleanHost = parser.hostname.replace(/^www\\./, '');
                    var subdomain = cleanHost.replace(/\\./g, '-');
                    var ampCacheUrl = 'https://' + subdomain + '.cdn.ampproject.org/c/s/' + cleanHost + parser.pathname + parser.search;
                    window.location.replace(ampCacheUrl);
                    return true;
                  } catch (e) {}
                }
                return false;
              };
              
              if (!check()) {
                var attempts = 0;
                var interval = setInterval(function() {
                  attempts++;
                  if (check() || attempts > 10) {
                    clearInterval(interval);
                  }
                }, 50);
              }
            }
          })();
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var reload = function() {
              var now = Date.now();
              var lastReload = sessionStorage.getItem('chunk_fail_reload');
              if (!lastReload || (now - parseInt(lastReload, 10) > 10000)) {
                sessionStorage.setItem('chunk_fail_reload', now.toString());
                window.location.reload();
              }
            };
            window.addEventListener('error', function(e) {
              var t = e.target;
              if (t && (t.tagName === 'SCRIPT' || t.tagName === 'LINK')) {
                var src = t.src || t.href;
                if (src && (src.indexOf('chunks') !== -1 || src.indexOf('_next') !== -1)) {
                  reload();
                }
              }
              var msg = e.message || (e.error && e.error.message);
              if (msg && (msg.indexOf('chunk') !== -1 || msg.indexOf('Loading') !== -1 || msg.indexOf('CSS') !== -1)) {
                reload();
              }
            }, true);
            window.addEventListener('unhandledrejection', function(e) {
              var msg = e.reason && (e.reason.message || e.reason.toString());
              if (msg && (msg.indexOf('chunk') !== -1 || msg.indexOf('Loading') !== -1 || msg.indexOf('CSS') !== -1)) {
                reload();
              }
            });
          })();
        `}} />
      </head>
      <body className="font-sans min-h-full flex flex-col text-white antialiased bg-(--bg-color)">
        {/* Google Analytics (gtag.js) - Advanced Consent Mode V2 with Crawler Camouflage */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                
                // Check stored consent or automatically grant for crawlers (Googlebot, Bingbot, Yandexbot)
                var isGranted = false;
                try {
                  isGranted = localStorage.getItem('Elit_cookie_consent') === 'granted';
                } catch(e){}
                
                var ua = navigator.userAgent.toLowerCase();
                var isBot = /bot|crawler|spider|robot|lighthouse|google|yandex|bing|baidu/i.test(ua);
                
                if (isGranted || isBot) {
                  gtag('consent', 'default', {
                    'analytics_storage': 'granted',
                    'ad_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                  });
                } else {
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'wait_for_update': 500
                  });
                }
                
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  'allow_google_signals': true,
                  'anonymize_ip': false,
                  'linker': {
                    'domains': ['istanbulescort.blog', 'bit.ly', 'escrehberi.click']
                  }
                });
              `}
            </Script>
          </>
        )}
        <BrowserIntelligence />
        <MobileAppBanner />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
