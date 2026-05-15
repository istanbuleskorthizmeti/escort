import Navbar from "@/components/UI/Navbar";
import { VerificationBadge } from "@/components/UI/ConciergeSuite";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-24 text-center">
          <VerificationBadge />
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase mb-8">
            <span className="text-zinc-600 block text-2xl tracking-[0.5em] mb-4">Legal Protocol</span>
            KULLANIM <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">ŞARTLARI</span>
          </h1>
          <p className="text-rose-600/60 text-xs font-black tracking-[0.2em] uppercase italic">
            Elit Terms of Engagement v4.0 // Last Updated: April 2026
          </p>
        </header>

        <section className="space-y-16 leading-relaxed">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-12 hover:border-rose-600/30 transition-all">
            <h2 className="text-2xl font-black italic uppercase text-white mb-6 border-l-8 border-rose-600 pl-6">
              01. Hizmet Kapsam� ve Egemenlik
            </h2>
            <p className="mb-6">
              vipescorthizmeti.com ("Platform"), elit ya�am tarz� ve profesyonel concierge hizmetlerine y�nelik bir rehberdir. Kullan�c�lar, platformu kullanarak sars�lmaz gizlilik standartlarıni ve burada belirtilen Prestij standartlar�n� kabul etmi� say�l�rlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-900 rounded-[2rem] p-8">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 uppercase">Ya� S�n�r�</h3>
              <p className="text-sm opacity-60 italic">
                Bu platformun i�eri�i yaln�zca +18 (onsekiz) ya� ve �zerindeki bireyler i�in tasarlanm��t�r. Ya� do�rulamas� yap�lmam�� eri�imler standart ihlali say�l�r.
              </p>
            </div>
            <div className="border border-zinc-900 rounded-[2rem] p-8">
              <h3 className="text-xl font-black italic uppercase text-rose-600 mb-4 uppercase">Etik Kurallar</h3>
              <p className="text-sm opacity-60 italic">
                Resmi temsilcilerimiz (City Admins) ile yap�lan t�m ileti�imlerde kar��l�kl� sayg� ve profesyonellik esast�r. Taciz veya standart d��� talepler s�resiz uzakla�t�rma nedenidir.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-black italic uppercase text-white mb-6">Yasal Sorumluluk Reddi</h2>
            <div className="p-8 bg-rose-950/10 border border-rose-900/30 rounded-2xl">
                <p className="text-sm text-zinc-400 mb-4">
                  Escortvip, ���nc� taraf sa�lay�c�lar taraf�ndan sunulan hizmetlerin i�eri�inden veya niteli�inden do�rudan sorumlu tutulamaz. Bizler, Hollanda yasalar�na tabi bir bilgi ve e�le�tirme standart� sa�lay�c�s�y�z.
                </p>
                <p className="text-sm text-zinc-500 italic">
                  Anla�mazl�klarda Amsterdam Tahkim Mahkemeleri ve AVG (Veri Koruma Kanunu) esas al�n�r.
                </p>
            </div>
          </div>

          <div className="bg-zinc-950/80 p-12 rounded-[3rem] border border-zinc-900 text-center">
            <div className="text-[10px] font-black tracking-[0.5em] text-zinc-700 uppercase mb-4">
               Official Elit Network // VIPESCORTHIZMETI.COM
            </div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest leading-loose">
               Kullan�m �artlar�n�n ihlali durumunda, platformun "Elit Shield" standart� kapsam�nda eri�imi k�s�tlama hakk� sakl�d�r.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          Prestij LEGAL GUARD // 2026
        </div>
      </footer>
    </div>
  );
}
