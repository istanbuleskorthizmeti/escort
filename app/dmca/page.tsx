import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { Scale, Mail, FileText, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA Compliance & Copyright Policy",
  description: "Web sitemizin telif hakları politikası, DMCA uyumluluğu ve içerik kaldırma talepleri için başvuru yönergeleri.",
};

export default function DMCAPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Intellectual Property</span>
            DMCA <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">POLICY</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            DIGITAL MILLENNIUM COPYRIGHT ACT // PROTECTED AETHEL
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Scale className="w-8 h-8 text-rose-600" /> DMCA Compliance Notice
            </h2>
            <p className="mb-6 text-zinc-400">
              Platformumuz, telif hakkı sahiplerinin fikri mülkiyet haklarına ve yasal hak taleplerine azami düzeyde saygı göstermeyi taahhüt eder. Sitemizde yer alan ve hak sahibi olduğunuzu iddia ettiğiniz herhangi bir içerik hakkında 5156 Sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi kanunu ve uluslararası DMCA yönergeleri çerçevesinde içerik kaldırma talebi gönderebilirsiniz.
            </p>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <FileText className="w-8 h-8 text-rose-600" /> Kaldırma Talebi Şartları
            </h2>
            <p className="mb-6 text-zinc-400">
              Göndereceğiniz telif hakkı ihlali bildirimlerinin geçerli sayılabilmesi için aşağıdaki unsurları barındırması yasal olarak zorunludur:
            </p>
            <ul className="space-y-4">
              {[
                "İhlal edildiği iddia edilen özel çalışmanın telif hakkı sahibi olduğunuzu veya onun adına yasal olarak hareket etmeye yetkili olduğunuzu gösterir imzalı belge.",
                "Sitemiz üzerinde telif hakkını ihlal ettiğini düşündüğünüz içeriğin tam URL adresi veya konum detayları.",
                "E-posta adresiniz, fiziki adresiniz ve telefon numaranız dahil olmak üzere geçerli iletişim bilgileriniz.",
                "Talebinizin dürüstçe ve iyi niyetle yapıldığını, hak sahibinin izni olmadan kullanıldığını onaylayan yazılı beyanınız."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                  <CheckCircle className="w-5 h-5 text-rose-600 mt-1 flex-shrink-0" />
                  <span className="text-sm text-zinc-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Mail className="w-8 h-8 text-rose-600" /> İletişim Kanalları
            </h2>
            <p className="mb-6 text-zinc-400">
              Telif hakkı ihlali ihbarlarınızı ve resmi DMCA başvurularınızı doğrudan legal departmanımıza ulaştırmak için <b>info@dorukcanay.digital</b> e-posta adresini kullanabilirsiniz. Yapılan başvurular teknik inceleme ekibimiz tarafından en geç 24 ile 48 saat içerisinde incelenerek sonuçlandırılacaktır.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <div className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">
              // INTELLECTUAL PROPERTY COOPERATION STANDARDS
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          LEGAL & COPYRIGHT GROUP // 2026
        </div>
      </footer>
    </div>
  );
}
