import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { Shield, Target, Award, Infinity } from "lucide-react";

export const metadata: Metadata = {
  title: "Manifesto | EscortVIP Otoritesi ve Vizyonu",
  description: "Lüks eşlik dünyasını yeniden tanımlayan sarsılmaz etik kurallarımız, vizyonumuz ve elit hizmet anlayışımız.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto py-32 px-6 md:px-12">
        <section className="text-center mb-32">
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-8">
            HAKKIMIZDA // THE MANIFESTO
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
            BİR <span className="text-rose-600">STANDARTIN</span> <br />
            ÖTESİNDE.
          </h1>
          <p className="text-zinc-500 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed italic">
            &quot;EscortVIP, sadece bir dizin değil; lüks eşlik dünyasında sarsılmaz bir güven kalesi, dijital bir gizlilik kalkanı ve elit yaşam tarzının mutlak temsilcisidir.&quot;
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-40">
           <div className="space-y-8 bg-zinc-950/50 border border-zinc-900 p-12 rounded-[3.5rem] hover:border-rose-600/30 transition-all duration-700">
              <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-600">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Sarsılmaz Gizlilik</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">Bizim için gizlilik bir opsiyon değil, temel bir haktır. Tüm sistemimiz &quot;Zero-Trace&quot; (Sıfır İz) standartları üzerine inşa edilmiştir. Ne müşterilerimizin ne de partnerlerimizin dijital ayak izi bırakmasına izin vermiyoruz.</p>
           </div>

           <div className="space-y-8 bg-zinc-950/50 border border-zinc-900 p-12 rounded-[3.5rem] hover:border-rose-600/30 transition-all duration-700">
              <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-600">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Niş Kürasyon</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">Sayıya değil, niteliğe odaklanıyoruz. Ağımıza dahil olan her profil, sıkı doğrulama süreçlerinden geçer. EscortVIP vitrininde sadece gerçek, teyitli ve yüksek standartlı profiller yer alabilir.</p>
           </div>

           <div className="space-y-8 bg-zinc-950/50 border border-zinc-900 p-12 rounded-[3.5rem] hover:border-rose-600/30 transition-all duration-700">
              <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-600">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Elit Deneyim</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">Modern beyefendilerin zamanının değerini biliyoruz. Hızlı rezervasyon, kesin teyit ve kusursuz eşlik için gereken tüm altyapıyı askeri düzeyde güvenlik ve lüks estetikle birleştiriyoruz.</p>
           </div>

           <div className="space-y-8 bg-zinc-950/50 border border-zinc-900 p-12 rounded-[3.5rem] hover:border-rose-600/30 transition-all duration-700">
              <div className="w-16 h-16 bg-rose-600/10 rounded-2xl flex items-center justify-center text-rose-600">
                <Infinity className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">Süreklilik</h3>
              <p className="text-zinc-500 leading-relaxed font-medium">2026&apos;dan bugüne, sektördeki kaosu düzene dönüştürmek için çalışıyoruz. EscortVIP markası, profesyonelliğin ve etik eşlik hizmetinin değişmez adresidir.</p>
           </div>
        </div>

        <section className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden text-center">
           <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 blur-[150px] rounded-full"></div>
           <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-10 relative z-10">Vizyonumuz: <br /><span className="text-rose-600">Geleceğin</span> Eşlik Kültürü</h2>
           <p className="text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed italic relative z-10 mb-12">
            Eşlik hizmetlerini tabulardan ve güvensizlikten arındırarak; karşılıklı saygı, mutlak şeffaflık ve üst düzey lüksün harmanlandığı küresel bir ağ oluşturmak temel hedefimizdir.
           </p>
           <div className="h-px w-32 bg-rose-600 mx-auto"></div>
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10">
          <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            EscortVIP.net // THE DRKCNAY AUTHORITY
          </div>
      </footer>
    </div>
  );
}
