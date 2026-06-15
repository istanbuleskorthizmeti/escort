import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 🏗️ MULTI-DOMAIN ASSET BRIDGE */
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://istanbulescort.blog' : undefined,
  
  /* OPSEC: Hide Next.js fingerprint from OSINT */
  poweredByHeader: false,
  distDir: process.env.BUILD_DIR || '.next',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {},
  serverExternalPackages: ["cheerio"],
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: [
      'lucide-react',
      '@/components/UI',
      'framer-motion',
      'clsx',
      'tailwind-merge'
    ],
    scrollRestoration: true,
  },

  async headers() {
    // 🛡️ Safe frame-ancestors matrix to prevent Clickjacking while allowing Google Sites
    const trustedFrameAncestors = [
      "'self'",
      "https://sites.google.com",
      "https://*.google.com",
      "https://istanbulescort.blog",
      "https://istanbulescort.blog",
      "https://escortvip.net",
      "https://vipescorthizmeti.shop",
      "https://bagcilarescort.shop",
      "https://esenyurtescort.blog",
      "https://esenyurtescorthizmeti.shop",
      "https://beylikduzuescortlistesi.shop",
      "https://besiktasescorthizmeti.shop",
      "https://besiktasescort.fun",
      "https://besiktasescort.blog",
      "https://taksimescorthizmeti.shop",
      "https://sefakoyescorthizmeti.shop",
      "https://kucukcekmecescort.shop",
      "https://sisliescort.shop",
      "https://avrupayakasiescort.shop",
      "https://istanbulescorthizmeti.shop",
      "https://kadikoyescort.shop",
      "https://pendikescorthizmeti.shop",
      "https://bucaescorthizmeti.shop",
      "https://izmitescorthizmeti.shop",
      "https://sariyerdrkcnay.shop",
      "https://leventdrkcnay.shop",
      "https://istanbuldrkcnay.shop",
      "https://istanbulescortkaporasiz.shop",
      "https://shopistanbulescortkaporasiz.site",
      "https://dorukcanay.digital"
    ].join(" ");

    return [
      {
        // 🔱 GOD-MODE: Allow external iframe embeds only for vitrin showcase endpoints
        source: '/embed/vitrin',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google-analytics.com; frame-ancestors ${trustedFrameAncestors}; object-src 'none';`
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
          }
        ]
      },
      {
        source: '/widget/vitrin',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google-analytics.com; frame-ancestors ${trustedFrameAncestors}; object-src 'none';`
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
          }
        ]
      },
      {
        // Tight security headers for all other main portal pages (Deny framing)
        source: '/((?!embed/vitrin|widget/vitrin|amp).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google-analytics.com; frame-src 'none'; object-src 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
      {
        // Relaxed CSP and no X-Frame-Options for AMP page to allow Google search cache iframe embedding
        source: '/amp',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdn.ampproject.org https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; frame-ancestors 'self' https://google.com https://*.google.com https://*.ampproject.org; object-src 'none';"
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/join',
        destination: 'http://dorukcanay.digital/go',
        permanent: true,
      },
      {
        source: '/kanal',
        destination: 'https://t.me/istanbulescorthizmeti',
        permanent: true,
      },
      {
        source: '/tg',
        destination: 'https://t.me/istanbulescorthizmeti',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(?<host>.*patron.*|.*xsportv.*|.*taraftar.*|.*futbol.*|.*canlimaclinki.*|.*kesintisizizle.*)' }],
        destination: '/api/sport-cloaker',
      },
      // 🐺 WOLF MODE: GÖRSEL SEO ZEHİRLEMESİ (IMAGE REWRITE)
      // /vip-profil-1.webp isteğini /api/media?src=/_media/vitrin/vip-profil-1.webp dosyasına bağlar ve MD5 hash değerini dinamik olarak değiştirir.
      {
        source: '/:city([a-zA-Z0-9]+)-kaporasiz-escort-bayan-:id(\\d+).webp',
        destination: '/api/media?src=/_media/vitrin/vip-profil-:id.webp&city=:city&id=:id',
      },
      {
        source: '/:city([a-zA-Z0-9]+)-rus-eskort-ilanlari-:id(\\d+).webp',
        destination: '/api/media?src=/_media/vitrin/vip-profil-:id.webp&city=:city&id=:id',
      },
      {
        source: '/:city([a-zA-Z0-9]+)-vip-escort-ilan-:id(\\d+).webp',
        destination: '/api/media?src=/_media/vitrin/vip-profil-:id.webp&city=:city&id=:id',
      },

      // 🐺 WOLF MODE: URL ZEHİRLEMESİ (SLUG INJECTION)
      // Müşteri /ilan/istanbul-escort/sisli adresine girdiğinde arka planda /istanbul/sisli çalışır. URL backlink gücü kazanır.
      {
        source: '/ilan/:city-escort/:district',
        destination: '/:city/:district',
      },
      {
        source: '/ilan/:city-vip-escort',
        destination: '/:city',
      }
    ];
  },
};

export default nextConfig;

