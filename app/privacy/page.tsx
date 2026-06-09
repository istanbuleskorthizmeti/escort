import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Nederlands Recht</span>
            GİZLİLİK <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">PROTOKOLÜ</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            AVG (Dutch GDPR) // Elit Privacy Standard v3.1
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6">
              01. Hollanda Yargı Yetkisi ve AVG
            </h2>
            <p className="mb-6">
              istanbulescort.blog, Hollanda merkezli bir platform olup, tüm veri işleme faaliyetlerinde <b>Algemene Verordening Gegevensbescherming (AVG)</b> standartlarını sarsılmaz bir şekilde uygular. Gizliliğiniz, Amsterdam mahkemelerinin yetki alanı ve Hollanda siber güvenlik kanunları ile korunmaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 tracking-tighter">Sıfır Veri Tutma</h3>
              <p className="text-sm opacity-60">
                Platformumuz, "Privacy by Design" ilkesine göre inşa edilmiştir. Gereksiz hiçbir veri toplanmaz, IP adresleri maskelenir ve oturumlar kapandığında tüm geçici izler Prestij imha standardıyla silinir.
              </p>
            </div>
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 tracking-tighter">Uçtan Uca Şifreleme</h3>
              <p className="text-sm opacity-60">
                Sağlayıcı ve kullanıcı arasındaki tüm dijital etkileşimler, Hollanda sunucularımız üzerinde askeri düzeyde şifreleme ile izole edilir. İçeriklerin üçüncü şahıslara sızması teknik olarak engellenmiştir.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6">Adult Sektörü Güvenceleri</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Daimi Görsel Mülkiyet Hakkı",
                "Anonim Profil Kontrolü",
                "İstendiğinde Tam Veri İmhası",
                "Yapay Cihan Taramasına Karşı Koruma",
                "Siber Zorbalığa Karşı Teknik Kalkan",
                "Gizli Ödeme Kanalları Güvenliği"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                  <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse shadow-glow-sm"></div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <p className="italic text-zinc-500 mb-8 lowercase first-letter:uppercase">
              "Gizlilik bir seçenek değil, egemen bir haktır. Dutch altyapımızla bu hakkı dijital kalenize dönüştürüyoruz."
            </p>
            <div className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase">
              // NO COOKIES // NO TRACKERS // NO COMPROMISE
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          AMSTERDAM Elit DATA PROTECTION COUNCIL // 2026
        </div>
      </footer>
    </div>
  );
}
