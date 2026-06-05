import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 🏗️ MULTI-DOMAIN ASSET BRIDGE */
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://vipescorthizmeti.com' : undefined,
  
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
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  serverExternalPackages: ["cheerio"],
  images: {
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
      "https://istanbulescdrkcn.com",
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
        // Tight security headers for all other main portal pages (Allow secure framing only)
        source: '/((?!embed/vitrin|widget/vitrin).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://*.google-analytics.com; frame-ancestors ${trustedFrameAncestors}; object-src 'none';`
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
    ];
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'escortvip.net' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vipescorthizmeti.com' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.vipescorthizmeti.com' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'vipescorthizmeti.shop' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'dorukcanay.digital' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.dorukcanay.digital' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'istanbulescdrkcn.com' }],
        destination: 'https://istanbulescort.blog/:path*',
        permanent: true,
      },
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
      // /vip-profil-1.webp isteğini /_media/vitrin/vip-profil-1.webp dosyasına bağlar ama URL aramalarda kaporasiz-escort-bayan olarak görünür.
      {
        source: '/:city-kaporasiz-escort-bayan-:id.webp',
        destination: '/_media/vitrin/vip-profil-:id.webp',
      },
      {
        source: '/:city-rus-eskort-ilanlari-:id.webp',
        destination: '/_media/vitrin/vip-profil-:id.webp',
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

