import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { ShieldAlert, CheckCircle, Database } from "lucide-react";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Kişisel Verilerin Korunması",
  description: "6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca kişisel verilerinizin işlenme amaçları ve haklarınız hakkında aydınlatma metni.",
};

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Mevzuat</span>
            KVKK <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">AYDINLATMA</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            6698 SAYILI KANUN UYUMLULUĞU // DATA PRIVACY v1.0
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <ShieldAlert className="w-8 h-8 text-rose-600" /> 01. Veri Sorumlusu ve Amacı
            </h2>
            <p className="mb-6 text-zinc-400">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, kişisel verileriniz; veri sorumlusu olarak platformumuz tarafından aşağıda açıklanan kapsamda işlenebilecektir. Bizim öncelikli vizyonumuz, verilerinizin gizliliğini korumak ve güvenliğini en üst düzeyde sağlamaktır. Sitemizdeki tüm veri işlemleri minimum veri tutma ("data minimization") ilkesine göre yürütülür.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Database className="w-8 h-8 text-rose-600" /> 02. İşlenen Veriler ve Yöntemler
            </h2>
            <p className="mb-6 text-zinc-400">
              Web sitemizi ziyaretleriniz sırasında sadece siber saldırıları engellemek, sistem performansını izlemek ve kullanıcı deneyimini optimize etmek amacıyla maskelenmiş IP adresleri ve anonim analitik veriler işlenir. Çerezler dışındaki verileriniz rızanız olmadan üçüncü taraflarla paylaşılmaz.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6">
              03. KVKK Kapsamındaki Haklarınız
            </h2>
            <p className="mb-6 text-zinc-400">
              Kanun'un 11. maddesi uyarınca veri sahipleri olarak şu haklara sahipsiniz:
            </p>
            <ul className="space-y-4">
              {[
                "Kişisel verilerinizin işlenip işlenmediğini öğrenme,",
                "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,",
                "Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,",
                "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,",
                "Kanun ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerinizin silinmesini veya yok edilmesini isteme."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                  <CheckCircle className="w-5 h-5 text-rose-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-zinc-400">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-zinc-400">
              Haklarınızı kullanmak ve kişisel verilerinizin imha edilmesini talep etmek için dilediğiniz zaman <b>info@dorukcanay.digital</b> adresine yazılı başvuru gönderebilirsiniz.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <div className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">
              // KVKK PROTECTION OFFICE // ELITE DATA
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          KVKK LEGAL COMPLIANCE AUDIT COUNCIL // 2026
        </div>
      </footer>
    </div>
  );
}
