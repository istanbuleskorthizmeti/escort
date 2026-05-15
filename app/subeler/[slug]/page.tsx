import { Metadata } from 'next';
import { BRANCHES, generateBranchSchema } from '../../../lib/gbp-pinning-data';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

// Global WhatsApp Config
const WHATSAPP_CONFIG = {
  number: "905356223402",
  defaultMessage: "Merhaba, dorukcanay.digital üzerinden ulaşıyorum."
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = BRANCHES.find(b => b.slug === slug);
  if (!branch) {
    const formattedSlug = slug.replace(/-/g, ' ').toUpperCase();
    return { title: `🔥 ${formattedSlug} VIP ŞUBE | %100 GERÇEK | DRKCNAY ELITE` };
  }

  return {
    title: `${branch.title} | Resmi Şube`,
    description: branch.description,
    robots: 'index, follow',
  };
}

export default async function BranchPage({ params }: Props) {
  const { slug } = await params;
  const branch = BRANCHES.find(b => b.slug === slug);
  
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

        <a 
          href={`https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage + ' (' + branch.title + ')')}`}
          className="mt-8 block w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(225,29,72,0.3)]"
        >
          WHATSAPP İLE BAĞLAN
        </a>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            setTimeout(() => {
              window.location.href = "https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.defaultMessage + ' (' + branch.title + ')')}";
            }, 3000);
          `
        }}
      />
    </div>
  );
}
