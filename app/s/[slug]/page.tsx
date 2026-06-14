import { Metadata } from 'next';
import { headers } from 'next/headers';
import { BRANCHES, generateBranchSchema } from '../../../lib/gbp-pinning-data';
import { generateNuclearMetadata, generateAllDistrictsSchema, generateAggressiveSemanticCloud } from '../../../lib/nuclear-seo-engine';
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

const WHATSAPP_CONFIG = {
  number: "12495448982",
  defaultMessage: "Merhaba, dorukcanay.digital üzerinden ulaşıyorum."
};

// BOT detection list
const BOT_AGENTS = ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider", "YandexBot", "GTmetrix", "Lighthouse"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = BRANCHES.find(b => b.slug === slug || b.slug.startsWith(slug));
  if (!branch) return generateNuclearMetadata(slug);

  return {
    title: `${branch.title} | ${slug.toUpperCase()} VIP`,
    description: branch.description,
    keywords: generateAggressiveSemanticCloud(),
    robots: 'index, follow',
  };
}

export default async function CloakedBranchPage({ params }: Props) {
  const { slug } = await params;
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));

  const branch = BRANCHES.find(b => b.slug === slug || b.slug.startsWith(slug));
  const branchSchema = branch ? generateBranchSchema(branch) : null;
  const allSchema = generateAllDistrictsSchema();

  // 🤖 BOT VIEW: Show Aggressive SEO & Schema
  if (isBot) {
    return (
      <div className="opacity-[0.01]">
        <h1>{slug.toUpperCase()} VIP Elite Partner & Moda Tasarım</h1>
        <p>{generateAggressiveSemanticCloud()}</p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(branchSchema || allSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchema) }}
        />
      </div>
    );
  }

  // 👤 USER VIEW: Instant WhatsApp Redirect
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-sans">
      <div className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl text-center shadow-2xl">
        <h1 className="text-3xl font-black italic tracking-tighter mb-4 text-rose-600 uppercase">
          {slug} VIP HATTI
        </h1>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
            GÜVENLİ YÖNLENDİRME YAPILIYOR...
          </p>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            // 🛰️ Global Tracking Radar
            fetch('/api/track-redirect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                domain: window.location.hostname,
                slug: "${slug}",
                title: "${branch?.title || slug}"
              })
            }).finally(() => {
              setTimeout(() => {
                window.location.href = "https://istanbulescort.blog";
              }, 500);
            });
          `
        }}
      />
    </div>
  );
}
