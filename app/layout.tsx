import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { getSiteId } from "@/lib/site-context";
import { ThemeEngine } from "@/lib/theme-engine";
import { BrowserIntelligence } from "@/components/SEO/BrowserIntelligence";
import { LocalAuthority } from "@/components/SEO/LocalAuthority";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: 'swap' });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: 'swap' });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

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
      'theme-color': '#e11d48', 
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
    <html lang="tr" className={`${playfair.variable} ${inter.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
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
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": `${brandTitle} hizmetleri kaporasız mı?`,
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `Evet, ${brandTitle} ağındaki tüm escort randevuları %100 kaporasızdır.`
                      }
                    }
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={`font-sans min-h-full flex flex-col text-white antialiased`} style={{ backgroundColor: theme.bgColor }}>
        <BrowserIntelligence />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
