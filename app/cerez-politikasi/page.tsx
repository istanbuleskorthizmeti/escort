import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { ShieldAlert, Cookie, EyeOff, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Çerez Politikası | Elit Güvenlik Protokolü",
  description: "Web sitemizde kullanılan çerezlerin türleri, amaçları ve çerez tercihlerinizi nasıl yöneteceğiniz hakkında detaylı bilgilendirme.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Mevzuat</span>
            ÇEREZ <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">POLİTİKASI</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            Cookie Consent Standard // v2.0
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <Cookie className="w-8 h-8 text-rose-600" /> 01. Çerezler Nedir?
            </h2>
            <p className="mb-6 text-zinc-400">
              Çerezler (Cookies), ziyaret ettiğiniz internet siteleri tarafından tarayıcınız aracılığıyla cihazınıza depolanan küçük veri dosyalarıdır. Bu dosyalar, platformumuzda gerçekleştirdiğiniz etkileşimleri geçici olarak hafızada tutarak kullanıcı deneyiminizi optimize etmek amacıyla kullanılır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 tracking-tighter flex items-center gap-2">
                <Settings className="w-5 h-5" /> Zorunlu Çerezler
              </h3>
              <p className="text-sm opacity-70">
                Web sitemizin düzgün çalışması, güvenli alanlara erişim ve temel navigasyon fonksiyonlarının yerine getirilmesi için zorunludur. Bu çerezler kapatılamaz.
              </p>
            </div>
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 tracking-tighter flex items-center gap-2">
                <EyeOff className="w-5 h-5" /> Performans Çerezleri
              </h3>
              <p className="text-sm opacity-70">
                Kullanıcılarımızın siteyi nasıl kullandığını analiz etmek, sayfa yükleme hızlarını ölçmek ve sistem performansını artırmak için anonimleştirilmiş istatistiksel veriler toplar.
              </p>
            </div>
          </div>

          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6 flex items-center gap-4">
              <ShieldAlert className="w-8 h-8 text-rose-600" /> 02. Çerezleri Nasıl Kontrol Edersiniz?
            </h2>
            <p className="mb-6 text-zinc-400">
              Tarayıcınızın ayarlarını değiştirerek çerezleri tamamen engelleyebilir, mevcut çerezleri silebilir veya sadece belirli çerezlerin kaydedilmesine izin verebilirsiniz. Çerezleri devre dışı bırakmanız durumunda, sitemizdeki bazı etkileşimli özelliklerin ve kişiselleştirilmiş servislerin kısmen veya tamamen çalışmayabileceğini hatırlatmak isteriz.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <p className="italic text-zinc-500 mb-8 lowercase first-letter:uppercase">
              "Verilerinize ve gizliliğinize sarsılmaz bir saygıyla yaklaşıyoruz. Hiçbir çerez kişisel kimliğinizi veya özel verilerinizi ifşa edecek şekilde kullanılmaz."
            </p>
            <div className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">
              // SECURE COOKIE STANDARDS // ENCRYPTED DATA
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          ELIT DATA PROTECTION COUNCIL // 2026
        </div>
      </footer>
    </div>
  );
}
