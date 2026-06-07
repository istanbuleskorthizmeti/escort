import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { Info, Shield, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Hukuki Bilgilendirme | Yasal Sorumluluk Reddi",
  description: "Web sitemizde yer alan içeriklerin hukuki statüsü, sorumluluk sınırları ve yasal bilgilendirme metni.",
};

export default function HukukiBilgilendirmePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Disclaimers</span>
            HUKUKİ <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">BİLGİLENDİRME</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            LEGAL DISCLAIMER & LIABILITY NOTICE // v1.1
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-rose-600/20 rounded-[3rem] p-12 hover:border-rose-600/40 transition-all shadow-[0_0_50px_rgba(225,29,72,0.05)]">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Info className="w-8 h-8 text-rose-600" /> Bilgilendirme Beyanı
            </h2>
            <p className="text-lg md:text-xl font-medium text-white italic mb-6">
              "Bu sitede ve projede yer alan içerikler bilgilendirme amaçlıdır ve kullanıcı deneyimini artırmak için hazırlanmıştır."
            </p>
            <p className="text-zinc-400">
              Platformumuzda yayınlanan hiçbir veri, görsel, metin veya reklam öğesi yasal tavsiye, bağlayıcı anlaşma veya resmi taahhüt niteliği taşımaz. Sitedeki verilerin doğruluğu ve güncelliği için azami gayret gösterilse de, olası farklılıklardan ötürü oluşabilecek durumlardan platformumuz doğrudan veya dolaylı olarak hukuki sorumluluk kabul etmez.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Shield className="w-8 h-8 text-rose-600" /> Sorumluluk Sınırları
            </h2>
            <p className="mb-6 text-zinc-400">
              Web sitemizi ziyaret eden her kullanıcı, aşağıdaki sorumluluk muafiyeti koşullarını kabul etmiş sayılır:
            </p>
            <ul className="space-y-4">
              {[
                "Kullanıcılar ile sitede yer alan reklam veren bağımsız sağlayıcılar arasındaki her türlü iletişim ve anlaşma tamamen tarafların kendi insiyatifindedir.",
                "Platformumuz hiçbir ticari anlaşmaya veya özel buluşmaya aracılık etmez, komisyon almaz ve taraf olmaz.",
                "Ziyaretçilerin kendi rızaları ile site dışı bağlantılara (linkler) yönlenmesi durumunda, hedef sitelerin içeriklerinden tamamen o sitelerin sahipleri sorumludur.",
                "İçeriklerin sunumunda ve kullanıcı deneyiminin iyileştirilmesinde modern siber standartlar ve yasal çerçeve esas alınmaktadır."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                  <CheckCircle className="w-5 h-5 text-rose-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-zinc-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <div className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">
              // USER EXPERIENCE PURPOSE ONLY // NO LIABILITY
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          LEGAL DEPT OF ELITE NETWORK // 2026
        </div>
      </footer>
    </div>
  );
}
