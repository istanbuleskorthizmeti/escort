import Link from "next/link";
import { Metadata } from "next";
import { headers } from "next/headers";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { siteConfig } from "@/config/site";
import { getCanonicalHost } from "@/lib/site-context";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const isFlagship = host.includes("dorukcanay.digital");

  return {
    title: isFlagship 
      ? "⭐ VIP Hizmet Standartları | Dorukcanay Elite Güvencesi"
      : `⭐ VIP Eşlik Hizmet Standartları - ${host.toUpperCase()}`,
    description: isFlagship
      ? "Dorukcanay Elite model ve refakatçi kalite standartları. Kaporasız buluşma garantisi, %100 gerçek görseller ve ödün vermeyen gizlilik."
      : `${host.toUpperCase()} resmi VIP eşlik, concierge ve güvenli buluşma standartları kılavuzu.`,
    alternates: {
      canonical: `https://${host}/standart`,
    },
  };
}

export default async function VIPStandardsPage() {
  const hostHeader = (await headers()).get("host") || siteConfig.domain;
  const host = getCanonicalHost(hostHeader);
  const isFlagship = host.includes("dorukcanay.digital");
  const brandName = isFlagship ? "DORUKCANAY ELITE" : host.toUpperCase();

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased overflow-hidden">
      {/* BACKGROUND GRAPHICS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-(--primary-color)/10 blur-[200px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-(--primary-color)/5 blur-[200px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.02] mix-blend-overlay"></div>
      </div>
 
      <Navbar />
 
      <main className="max-w-5xl mx-auto py-24 px-6 md:px-12 relative">
        <section className="text-center mb-32">
          <div className="mb-8 flex justify-center">
            <VerificationBadge />
          </div>
          <h1 className="text-6xl md:text-[8rem] font-black mb-8 tracking-tighter leading-[0.85] italic uppercase">
            HİZMET <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-(--primary-color) via-rose-500 to-amber-300 drop-shadow-glow">
              STANDARTLARI
            </span>
          </h1>
          <p className="text-zinc-500 text-lg md:text-2xl font-black italic tracking-tight max-w-3xl mx-auto leading-relaxed mt-8 opacity-80">
            {host} platformundaki tüm profiller ve concierge işlemleri, aşağıda belirtilen katı kalite ve etik kurallarına tabidir. Güvenliğiniz ve memnuniyetiniz bizim için bir seçenek değil, mutlak bir yasadır.
          </p>
        </section>

        {/* THE 4 PILLARS OF OUR QUALITY ASSURANCE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          {/* Pillar 1: No Pre-payments */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] p-12 hover:border-(--primary-color)/50 transition-all duration-500">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-(--primary-color) font-black text-xl mb-8">
              01
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-4">KAPORASIZ BULUŞMA</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              Sistemimizdeki hiçbir partner sizden buluşma öncesinde rezervasyon ücreti, taksi parası veya kapora adı altında ön ödeme talep etmez. Ödemeler yalnızca buluşma anında elden gerçekleştirilir.
            </p>
          </div>

          {/* Pillar 2: 100% Real Visuals */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] p-12 hover:border-(--primary-color)/50 transition-all duration-500">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-(--primary-color) font-black text-xl mb-8">
              02
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-4">%100 GERÇEK GÖRSELLER</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              Vitrinimizde listelenen tüm fotoğraflar, partnerlerin güncel fiziksel görünümlerini yansıtmaktadır. Temsili, yanıltıcı veya çalıntı görsel kullanan profiller ağımızdan süresiz olarak uzaklaştırılır.
            </p>
          </div>

          {/* Pillar 3: Absolute Privacy */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] p-12 hover:border-(--primary-color)/50 transition-all duration-500">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-(--primary-color) font-black text-xl mb-8">
              03
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-4">DİJİTAL MAHREMİYET</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              Siber altyapımızda &quot;Zero-Trace&quot; (Sıfır İz) standartları geçerlidir. IP adresleriniz, yazışmalarınız veya arama geçmişiniz sunucularımızda kesinlikle saklanmaz ve 24 saatte bir otomatik temizlenir.
            </p>
          </div>

          {/* Pillar 4: Quality & Hygiene */}
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-[2.5rem] p-12 hover:border-(--primary-color)/50 transition-all duration-500">
            <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-(--primary-color) font-black text-xl mb-8">
              04
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white mb-4">HİJYEN VE PRESTİJ</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              Sağlık ve hijyen standartları en üst düzeyde denetlenmektedir. Refakat süreçleri boyunca nezaket, zamanlama sadakati ve karşılıklı saygı kuralları çerçevesinde profesyonel hizmet sunulmaktadır.
            </p>
          </div>
        </section>

        {/* SYSTEM DISCIPLINE DETAILS */}
        <section className="bg-zinc-950/30 border border-zinc-900 rounded-[3.5rem] p-16 relative">
          <h3 className="text-3xl font-black italic uppercase tracking-wider text-(--primary-color) mb-10 border-l-8 border-(--primary-color) pl-8">
            GÜVENLİK BİLGİLENDİRMESİ
          </h3>
          <p className="text-zinc-400 text-base leading-relaxed mb-8">
            Son dönemde internet üzerinde bizim adımızı veya görsellerimizi kullanarak ön ödeme/kapora dolandırıcılığı yapmaya çalışan şahıslara karşı dikkatli olmanızı rica ederiz. {brandName} bünyesindeki hiçbir temsilci veya model sizden banka havalesi veya Fast/EFT yoluyla para göndermenizi talep etmez.
          </p>
          <div className="bg-black/50 border border-dashed border-zinc-800 rounded-2xl p-6 text-zinc-500 text-xs leading-relaxed uppercase tracking-wider">
            🚨 UYARI: Eğer bir telefon numarasından veya web sayfasından size &quot;kapora ödemeden adrese gelinmez&quot; deniyorsa, o numara kesinlikle {host} ağına ait değildir.
          </div>
        </section>
      </main>

      <footer className="py-32 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase italic opacity-25">
            {brandName} // ESTABLISHED 2026
          </div>
          <div className="flex justify-center flex-wrap gap-12 text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic">
            <Link href="/" className="hover:text-(--primary-color) transition-colors">ANASAYFA</Link>
            <Link href="/protokol" className="hover:text-(--primary-color) transition-colors">PROTOKOL</Link>
            <Link href="/rehber" className="hover:text-(--primary-color) transition-colors">REHBER</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
