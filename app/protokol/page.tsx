import Link from "next/link";
import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "🛡️ Elit Elite Hub | VIP Protokol ve Topluluk Merkezi",
  description: "EscortVip Elit ağının resmi iletişim ve protokol hubı. Elite topluluk güncellemeleri, sarsılmaz gizlilik kodları ve VIP erişim hatları.",
  alternates: {
    canonical: `https://${siteConfig.domain}/protokol`,
  },
};

export default function VIPProtocolHub() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased overflow-hidden">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[200px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-600/5 blur-[200px] rounded-full animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <Navbar />

      <main className="max-w-5xl mx-auto py-24 px-6 md:px-12 relative">
        <section className="text-center mb-40">
          <VerificationBadge />
          <h1 className="text-7xl md:text-[10rem] font-black mb-8 tracking-tighter leading-[0.85] italic uppercase">
            DRKCNAY <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 via-rose-500 to-rose-300 drop-shadow-glow">
              ELITE HUB
            </span>
          </h1>
          <p className="text-zinc-500 text-xl md:text-3xl font-black italic tracking-tight lowercase first-letter:uppercase max-w-3xl mx-auto leading-tight mt-12 mb-20 opacity-80">
            vipescorthizmeti.com DRKCNAY Protocol ağının kalbi burasıdır. İletişimde kesintisiz erişim, anlık katalog güncellemeleri ve üst düzey gizlilik protokolleri için merkezi bağlantı noktanız.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
            {/* WHATSAPP CTA */}
            <Link 
              href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
              target="_blank"
              className="group relative bg-zinc-950 border border-rose-600/30 rounded-[3rem] p-16 transition-all duration-700 hover:border-rose-600 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-rose-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex flex-col items-center gap-10">
                <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-glow group-hover:scale-110 transition-transform duration-700">
                  WA
                </div>
                <div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">WHATSAPP KANALIMIZA KATIL</h2>
                  <p className="text-zinc-500 text-sm font-medium italic opacity-60 leading-relaxed uppercase tracking-widest">
                    Numara değişimleri, yeni kataloglar ve anlık bildirimler için ana iletişim kanalımız.
                  </p>
                </div>
                <div className="bg-rose-600 text-white font-black py-6 px-12 rounded-full uppercase tracking-[0.2em] italic text-xs group-hover:bg-white group-hover:text-black transition-colors">
                  KATILIM PROTOKOLÜNÜ BAŞLAT →
                </div>
              </div>
            </Link>

            {/* TELEGRAM CTA (PLACEHOLDER FOR NOW AS REQUESTED) */}
            <div className="group relative bg-zinc-950/50 border border-zinc-900 rounded-[3rem] p-16 transition-all duration-700 hover:border-zinc-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100">
              <div className="relative z-10 flex flex-col items-center gap-10">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-500 text-5xl font-black border border-zinc-800">
                  TG
                </div>
                <div>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 opacity-40">TELEGRAM VIP GRUBU</h2>
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">SOON // YAKINDA</p>
                  <p className="text-zinc-500 text-sm font-medium italic opacity-40 leading-relaxed">
                    Gizliliğin en üst seviyesi ve geniş topluluk erişimi için VIP Telegram altyapımız hazırlanıyor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* REASONS SECTION */}
        <section className="bg-zinc-950/40 border border-zinc-900 rounded-[4rem] p-16 md:p-24 overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 transition-transform duration-1000 group-hover:rotate-0">
             <span className="text-[150px] font-black italic">TRUST</span>
           </div>
           
           <h3 className="text-3xl font-black italic uppercase tracking-widest text-rose-600 mb-16 border-l-8 border-rose-600 pl-8">NEDEN ELITE HUB?</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="space-y-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase italic">01. Güvenlik</span>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">NUMARA GÜVENLİĞİ</h4>
                <p className="text-zinc-500 text-sm font-medium italic leading-relaxed opacity-60">Sistemimizdeki numara değişimlerinden anında haberdar olun, iletişimi asla kaybetmeyin.</p>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase italic">02. Hız</span>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">ANLIK KATALOG</h4>
                <p className="text-zinc-500 text-sm font-medium italic leading-relaxed opacity-60">En yeni profiller ve lokasyon güncellemeleri saniyeler içinde cebinizde.</p>
              </div>

              <div className="space-y-6">
                <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase italic">03. Gizlilik</span>
                <h4 className="text-2xl font-black italic uppercase tracking-tighter text-white">VIP ŞİFRELEME</h4>
                <p className="text-zinc-500 text-sm font-medium italic leading-relaxed opacity-60">WhatsApp kanalları gizlilik esasına göre çalışır, bilgilerinizi diğer üyeler göremez.</p>
              </div>
           </div>
        </section>

        {/* FAQ SECTION */}
        <section className="mt-40 space-y-24 bg-zinc-950/40 p-16 md:p-24 border border-zinc-900 rounded-[4rem] group hover:border-rose-600 transition-all duration-1000">
          <h3 className="text-3xl font-black italic uppercase tracking-widest text-white mb-10 border-l-8 border-rose-600 pl-8">SIKÇA SORULAN SORULAR</h3>
          <div className="space-y-16">
            <div className="space-y-4">
              <h4 className="text-xl font-black italic text-rose-600 uppercase tracking-tighter">01. NUMARA DEĞİŞTİĞİNDE NASIL ERİŞİM SAĞLARIM?</h4>
              <p className="text-zinc-500 text-sm font-medium italic leading-relaxed opacity-60">
                DRKCNAY Protocol gereği, tüm numara değişimleri bu kanaldaki &quot;Pinned Messages&quot; (Sabitlenen Mesajlar) kısmında anlık olarak güncellenir. Kanala abone olmanız, iletişimi asla kaybetmemenizi sağlar.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black italic text-rose-600 uppercase tracking-tighter">02. VERİ GİZLİLİĞİ VE ANONİMİTE STANDARTLARI NELERDİR?</h4>
              <p className="text-zinc-500 text-sm font-medium italic leading-relaxed opacity-60">
                WhatsApp kanallarında üyelerin profil bilgileri veya telefon numaraları diğer üyeler tarafından görülemez. Tüm etkileşimler uçtan uca şifreleme ve mutlak anonimite prensibiyle yönetilir.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-black italic text-rose-600 uppercase tracking-tighter">03. VIP TELEGRAM GRUBU NE ZAMAN AKTİF OLACAK?</h4>
              <p className="text-zinc-500 text-sm font-medium italic leading-relaxed opacity-60">
                Telegram VIP altyapımız, daha geniş katalog erişimi ve interaktif topluluk dinamikleri için test aşamasındadır. Aktivasyon duyurusu öncelikle WhatsApp kanalımızdan yapılacaktır.
              </p>
            </div>
          </div>
        </section>

        {/* THE 5 ABSOLUTE CODE MODULES */}
        <section className="mt-40 mb-40">
           <div className="flex flex-col items-center text-center mb-24">
              <span className="text-rose-600 font-black tracking-[0.6em] uppercase text-[10px] mb-4">Mastery Layers</span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">MUTLAK <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">KOD</span> MODÜLLERİ</h2>
              <p className="text-zinc-500 max-w-2xl font-medium italic">Elit ağındaki her etkileşim, bu 5 temel disiplin üzerine inşa edilmiştir. Bu modüller, sıradan bir randevuyu elite bir protokole dönüştürür.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 01. Fantasy Archaeology */}
              <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-rose-600 transition-all duration-700 group">
                 <div className="text-rose-600 text-5xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity mb-8">01</div>
                 <h3 className="text-2xl font-black italic uppercase mb-4">Fantasy Archaeology</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">Bastırılmış arzuların ve arkaik fantezilerin bilimsel analizi. Bilinçaltındaki sembolleri birer deneyime dönüştürme sanatı.</p>
                 <div className="h-1 w-12 bg-zinc-800 group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* 02. Bio-Performance */}
              <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-rose-600 transition-all duration-700 group sm:col-span-1">
                 <div className="text-rose-600 text-5xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity mb-8">02</div>
                 <h3 className="text-2xl font-black italic uppercase mb-4">Bio-Performance</h3>
                 <div className="text-[8px] font-black text-rose-600 mb-4 tracking-widest uppercase">DR. DORUKCAN AY ONAYLI</div>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">Biyolojik verimlilik ve cinsel enerji optimizasyonu. Hormonal denge ve uzun süreli performans için biyo-hacking protokolleri.</p>
                 <div className="h-1 w-12 bg-zinc-800 group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* 03. Intimacy Alchemy */}
              <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-rose-600 transition-all duration-700 group sm:col-span-1">
                 <div className="text-rose-600 text-5xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity mb-8">03</div>
                 <h3 className="text-2xl font-black italic uppercase mb-4">Intimacy Alchemy</h3>
                 <div className="text-[8px] font-black text-rose-600 mb-4 tracking-widest uppercase">EDA NUR ONAYLI</div>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">Duygusal rezonans ve tensel simya. İki ruh arasındaki enerjiyi en saf ve en kışkırtıcı haliyle birleştirme disiplini.</p>
                 <div className="h-1 w-12 bg-zinc-800 group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* 04. Sex-Tech Integration */}
              <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-rose-600 transition-all duration-700 group sm:col-span-1">
                 <div className="text-rose-600 text-5xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity mb-8">04</div>
                 <h3 className="text-2xl font-black italic uppercase mb-4">Sex-Tech Integration</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">Geleceğin hazzını bugünden yaşayın. Sex-tech ve akıllı arayüzlerin, insani dokunuşla kusursuz entegrasyonu.</p>
                 <div className="h-1 w-12 bg-zinc-800 group-hover:w-full transition-all duration-700"></div>
              </div>

              {/* 05. Elit Safety */}
              <div className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-rose-600 transition-all duration-700 group md:col-span-2 lg:col-span-2">
                 <div className="text-rose-600 text-5xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity mb-8">05</div>
                 <h3 className="text-2xl font-black italic uppercase mb-4">Elit Safety Protocols</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed mb-8 italic">Sarsılmaz gizlilik ve güvenlik mimarisi. Hem beyefendilerin hem de profillerimizin anonimitesini sağlayan çelik kasa protokolleri.</p>
                 <div className="h-1 w-12 bg-zinc-800 group-hover:w-full transition-all duration-700"></div>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-40 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase italic opacity-20 mb-10">
            Elit NETWORK // ESTABLISHED 2026
          </div>
          <div className="flex justify-center flex-wrap gap-12 text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em] italic">
            <Link href="/istanbul" className="hover:text-rose-600 transition-colors">ISTANBUL</Link>
            <Link href="/blog" className="hover:text-rose-600 transition-colors">BLOG</Link>
            <Link href="/rehber" className="hover:text-rose-600 transition-colors">REHBER</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
