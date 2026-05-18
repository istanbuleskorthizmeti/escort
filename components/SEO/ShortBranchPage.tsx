import { Metadata } from 'next';
import { BRANCHES, generateBranchSchema } from '../../lib/gbp-pinning-data';
import { notFound } from 'next/navigation';

// Static district handler for ultra-short URLs
const WHATSAPP_CONFIG = {
  number: "905520949245",
  defaultMessage: "Merhaba, dorukcanay.digital üzerinden ulaşıyorum."
};

async function getBranch(slug: string) {
    // Map short slugs to internal slugs if needed
    const mapping: Record<string, string> = {
        'sisli': 'sisli-elite-concierge',
        'beylikduzu': 'beylikduzu-skyport-vip',
        'kadikoy': 'kadikoy-vip-tasarim'
    };
    const targetSlug = mapping[slug] || slug;
    return BRANCHES.find(b => b.slug === targetSlug);
}

export default async function ShortBranchPage({ district }: { district: string }) {
  const branch = await getBranch(district);
  
  if (!branch) {
    notFound();
  }

  const schema = generateBranchSchema(branch);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      <div className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl text-center shadow-2xl">
        <h1 className="text-3xl font-black italic tracking-tighter mb-4 text-rose-600">
          {branch.title.toUpperCase()}
        </h1>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          {branch.description}
        </p>
        
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
            Güvenli Hat Bağlanıyor...
          </p>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              window.location.href = "https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage + ' (' + branch.title + ')')}";
            }, 1000);
          `
        }}
      />
    </div>
  );
}
