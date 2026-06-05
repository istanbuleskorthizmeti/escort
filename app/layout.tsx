import type { Metadata, Viewport } from "next";
import "./globals.css";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import Script from "next/script";
import { getSiteId } from "@/lib/site-context";
import { ThemeEngine } from "@/lib/theme-engine";
import { BrowserIntelligence } from "@/components/SEO/BrowserIntelligence";
import { LocalAuthority } from "@/components/SEO/LocalAuthority";

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
  const brandTitle = theme.brandName;
  const title = `🔞 ${brandTitle} | %100 GERÇEK VE VAHŞİ ESCORT İLANLAR`;
  const description = `${brandTitle}: İstanbul'un en hiddetli escort rehberi. ${theme.slogan}. Kaporasız, gerçek ve sınırsız escort bayanlar ile VIP deneyim.`;

  return {
    title,
    description,
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
  try {
    const h = await headers();
    host = h.get("host") || siteConfig.domain;
  } catch (e) {}
  
  const theme = ThemeEngine.getTheme(host);
  const brandTitle = theme.brandName;

  return (
    <html lang="tr" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Outfit:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;1,900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-playfair: 'Playfair Display', serif;
            --font-outfit: 'Outfit', sans-serif;
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
                  "telephone": "+905520949245",
                  "priceRange": "₺₺₺",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Istanbul",
                    "addressCountry": "TR"
                  }
                }
              ]
            })
          }}
        />
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
      <body className={`font-sans min-h-full flex flex-col text-white antialiased`} style={{ backgroundColor: theme.bgColor }}>
        {/* Google Analytics (gtag.js) - Advanced Consent Mode V2 with Crawler Camouflage */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5N1LVB5EWE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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
            gtag('config', 'G-5N1LVB5EWE', {
              'allow_google_signals': true,
              'anonymize_ip': false,
              'linker': {
                'domains': ['vipescorthizmeti.com', 'bit.ly', 'escrehberi.click']
              }
            });
          `}
        </Script>
        <BrowserIntelligence />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
