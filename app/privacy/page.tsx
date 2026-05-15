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
            G�ZL�L�K <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">PROTOKOL�</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            AVG (Dutch GDPR) // Elit Privacy Standard v3.1
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6">
              01. Hollanda Yarg� Yetkisi ve AVG
            </h2>
            <p className="mb-6">
              vipescorthizmeti.com, Hollanda merkezli bir platform olup, t�m veri i�leme faaliyetlerinde <b>Algemene Verordening Gegevensbescherming (AVG)</b> standartlar�n� sars�lmaz bir �ekilde uygular. Gizlili�iniz, Amsterdam mahkemelerinin yetki alan� ve Hollanda siber g�venlik kanunlar� ile korunmaktad�r.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 tracking-tighter">S�f�r Veri Tutma</h3>
              <p className="text-sm opacity-60">
                Platformumuz, "Privacy by Design" ilkesine g�re in�a edilmi�tir. Gereksiz hi�bir veri toplanmaz, IP adresleri maskelenir ve oturumlar kapand���nda t�m ge�ici izler Prestij imha protokol�yle silinir.
              </p>
            </div>
            <div className="border border-zinc-900 rounded-[2rem] p-8 hover:bg-zinc-950 transition-colors">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 tracking-tighter">U�tan Uca Şifreleme</h3>
              <p className="text-sm opacity-60">
                Sa�lay�c� ve kullan�c� aras�ndaki t�m dijital etkile�imler, Hollanda sunucular�m�z �zerinde askeri d�zeyde �ifreleme ile izole edilir. ��eriklerin ���nc� �ah�slara s�zmas� teknik olarak engellenmi�tir.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6">Adult Sekt�r� G�venceleri</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Daimi G�rsel M�lkiyet Hakk�",
                "Anonim Profil Kontrol�",
                "�stendi�inde Tam Veri �mhas�",
                "Yapay Zeka Taramas�na Kar�� Koruma",
                "Siber Zorbal��a Kar�� Teknik Kalkan",
                "Gizli �deme Kanallar� G�venli�i"
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
              "Gizlilik bir se�enek de�il, egemen bir hakt�r. Dutch altyap�m�zla bu hakk� dijital kalenize d�n��t�r�yoruz."
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
