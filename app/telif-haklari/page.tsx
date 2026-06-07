import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { ShieldAlert, FileText, CheckCircle, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Telif Hakları Protokolü | Copyright Protection",
  description: "Web sitemizde yer alan tüm dijital materyallerin, görsellerin ve özgün metinlerin telif hakları korunma şartları.",
};

export default function TelifHaklariPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Mülkiyet</span>
            TELİF <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">HAKLARI</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            DIGITAL COPYRIGHT PROTECTION // ELITE NETWORK 2026
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Lock className="w-8 h-8 text-rose-600" /> 01. Özgün İçerik Mülkiyeti
            </h2>
            <p className="mb-6 text-zinc-400">
              Web sitemizde (ve tüm bağlı Hydra ağ uydularında) yayınlanan metinler, makaleler, sayfa tasarımları, grafikler, kod yapıları ve patentli veri tabanları fikri ve sınai mülkiyet hukuku koruması altındadır. Kaynak gösterilse dahi bu içeriklerin kopyalanması, kazınması ("web scraping"), botlar ile çekilmesi veya başka platformlarda izinsiz yayınlanması kesinlikle yasaktır.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <FileText className="w-8 h-8 text-rose-600" /> 02. Görsel Materyal Hakları
            </h2>
            <p className="mb-6 text-zinc-400">
              Profil sayfalarında yer alan görseller ve video çekimleri, doğrudan hak sahibi olan bağımsız eşlik sağlayıcılarına ve/veya onların yasal ajanslarına aittir. Bu görsellerin indirerek, ekran görüntüsü alarak veya klon siteler aracılığıyla izinsiz kullanılması durumunda uluslararası telif hakları ihlali (DMCA) ve şantaj/kişisel hakların ihlali kapsamında yasal işlem başlatılır.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <ShieldAlert className="w-8 h-8 text-rose-600" /> 03. İhlal Durumunda Yasal Süreç
            </h2>
            <p className="mb-6 text-zinc-400">
              İçeriklerimizin izinsiz kopyalanması durumunda hukuk ekibimiz tarafından şu adımlar atılacaktır:
            </p>
            <ul className="space-y-4">
              {[
                "Klon veya hırsız sitenin sunucu sağlayıcısına (Hosting Provider) derhal resmi kapatma/kaldırma ihbarnamesi gönderilir.",
                "Google, Bing, Yandex ve diğer arama motorlarına DMCA şikayeti yapılarak, çalıntı URL'lerin indekslerden silinmesi sağlanır.",
                "İçeriği çalan kişi veya kurumlara karşı maddi ve manevi tazminat davası açılır."
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
              // PATENT AND DIGITAL RIGHTS ENFORCEMENT
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          ELIT NETWORK LAW DEPARTMENT // 2026
        </div>
      </footer>
    </div>
  );
}
