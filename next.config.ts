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
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@/components/UI',
      'framer-motion'
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL'
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors *"
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
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, OPTIONS'
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
        destination: 'https://vipescorthizmeti.com/:path*',
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
      {
        source: '/robots.txt',
        has: [{ type: 'host', value: '(?<host>.*)' }],
        destination: '/api/seo?host=:host&file=robots.txt',
      },
      {
        source: '/sitemap.xml',
        has: [{ type: 'host', value: '(?<host>.*)' }],
        destination: '/api/seo?host=:host&file=sitemap.xml',
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
      },
      {
        source: '/sitemap-:id.xml',
        has: [{ type: 'host', value: '(?<host>.*)' }],
        destination: '/api/seo?host=:host&file=sitemap-:id.xml',
      }
    ];
  },
};

export default nextConfig;

