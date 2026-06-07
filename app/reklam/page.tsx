import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { Megaphone, Compass, Zap, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "Reklam ve Sponsorluk Paketleri | EscortVIP",
  description: "Vitrinimizde yer almak, premium sponsorluk paketleri ve reklam başvuru süreci hakkında detaylı bilgilendirme.",
};

export default function ReklamPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Partnership</span>
            REKLAM & <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">SPONSORLUK</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            ELITE TRAFFIC MONETIZATION // ADVERTISING SERVICES
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Megaphone className="w-8 h-8 text-rose-600" /> Vitrinimizde Yer Alın
            </h2>
            <p className="mb-6 text-zinc-400">
              EscortVIP ağı, Türkiye genelinde günlük yüz binlerce organik, yüksek dönüşüm oranına sahip elit ziyaretçiyi ağırlamaktadır. Vitrinimizde bağımsız eşlik sağlayıcısı veya ajans olarak yer almak, hedef kitlenize en prestijli şekilde ulaşmanın en doğrudan yoludur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <Compass className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-lg font-black italic uppercase text-white mb-2 tracking-tighter">Bölgesel Hedefleme</h3>
              <p className="text-xs opacity-60">
                Sadece hizmet verdiğiniz semt, ilçe veya şehirdeki aramalarda üst sıralarda listelenerek bütçenizi en verimli şekilde kullanırsınız.
              </p>
            </div>
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <Zap className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-lg font-black italic uppercase text-white mb-2 tracking-tighter">Premium Vitrin</h3>
              <p className="text-xs opacity-60">
                Ana sayfamızda ve şehir listelemelerinde en üst sıralarda, dikkat çekici animasyonlu çerçeveler ve öne çıkarılan etiketlerle yayınlanırsınız.
              </p>
            </div>
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <Target className="w-8 h-8 text-rose-600 mb-4" />
              <h3 className="text-lg font-black italic uppercase text-white mb-2 tracking-tighter">Tam Doğrulama</h3>
              <p className="text-xs opacity-60">
                Reklam veren tüm profillerimiz 'Doğrulanmış Üye' rozetine sahip olarak ziyaretçiler nezdinde maksimum güvenilirlik elde eder.
              </p>
            </div>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all text-center">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6">Reklam Başvurusu İçin</h2>
            <p className="mb-8 text-zinc-400">
              Mevcut boş yer durumunu öğrenmek, fiyatlandırma tablolarını talep etmek ve başvurunuzu iletmek için legal destek departmanımızla iletişime geçebilirsiniz.
            </p>
            <a href="/iletisim" className="inline-block bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-rose-600 hover:text-white transition-all">
              Başvuru Formuna Git
            </a>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <div className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">
              // ELITE SPONSORSHIPS // TARGETED CONVERSIONS
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          ESCORTVIP MEDIA GROUP // 2026
        </div>
      </footer>
    </div>
  );
}
