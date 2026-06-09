import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { Camera, ShieldCheck, UserCheck, Search, Image as ImageIcon, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Doğrulama Standartları | EscortVIP %100 Gerçek Profil Garantisi",
  description: "EscortVIP ağındaki profillerin nasıl doğrulandığına dair askeri düzeyde şeffaflık ve güvenlik standartlarımiz.",
};

export default function VerificationProtocolPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto py-32 px-6 md:px-12">
        <section className="text-center mb-32">
          <div className="flex justify-center mb-6">
            <VerificationBadge />
          </div>
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-8">
            GÜVENLİK STANDARTLARI // VERIFICATION
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
            HİÇBİR ŞEYİ <br /><span className="text-rose-600">ŞANSA</span> BIRAKMAYIN.
          </h1>
          <p className="text-zinc-500 text-xl font-medium max-w-3xl mx-auto leading-relaxed italic">
            &quot;EscortVIP ağındaki her profil, özel bir doğrulama matrisinden geçer. Sahte fotoğraflara, yanlış bilgilere ve düşük kaliteli içeriğe bu ağda yer yoktur.&quot;
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
           <div className="bg-zinc-950/40 border border-zinc-900 p-12 rounded-[3rem] hover:border-rose-600/30 transition-all duration-700">
              <Camera className="w-10 h-10 text-rose-600 mb-8" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Görsel Teyit</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Partner adayları, sistemimize &apos;Canlı El Hareketli&apos; fotoğraflar sunmak zorundadır. Bu sayede fotoğrafların güncelliği ve profilin gerçekliği %100 saptanır.</p>
           </div>

           <div className="bg-zinc-950/40 border border-zinc-900 p-12 rounded-[3rem] hover:border-rose-600/30 transition-all duration-700">
              <ShieldCheck className="w-10 h-10 text-rose-600 mb-8" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Fiziksel Maç</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">Profil açıklamasında belirtilen boy, kilo ve yaş bilgileri, moderasyon ekibimiz tarafından çapraz kontrolle onaylanır. Yanıltıcı bilgiye sıfır tolerans uygulanır.</p>
           </div>

           <div className="bg-zinc-950/40 border border-zinc-900 p-12 rounded-[3rem] hover:border-rose-600/30 transition-all duration-700">
              <UserCheck className="w-10 h-10 text-rose-600 mb-8" />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Üye Referansı</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">VIP üyelerimizden gelen geri bildirimler, profillerin &apos;Hizmet Kalitesi&apos; puanını belirler. Standartların altına düşen profiller ağdan uzaklaştırılır.</p>
           </div>
        </section>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform duration-1000 group-hover:rotate-0">
             <Search className="w-64 h-64" />
           </div>
           
           <h2 className="text-3xl font-black italic uppercase tracking-widest text-white mb-16 border-l-8 border-rose-600 pl-8">NASIL DOÄRULUYORUZ?</h2>
           
           <div className="space-y-16 relative z-10">
              <div className="flex gap-10 items-start">
                 <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-600 shrink-0 font-black italic text-2xl">01</div>
                 <div>
                    <h4 className="text-2xl font-black italic uppercase mb-2">Başvuru Filtresi</h4>
                    <p className="text-zinc-500 leading-relaxed max-w-2xl">Partner, gizli Telegram botumuz üzerinden başvurusu yapar. İlk aşamada estetik ve hizmet standartları kontrol edilir.</p>
                 </div>
              </div>

              <div className="flex gap-10 items-start">
                 <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-600 shrink-0 font-black italic text-2xl">02</div>
                 <div>
                    <h4 className="text-2xl font-black italic uppercase mb-2">Canlı İçerik Talebi</h4>
                    <p className="text-zinc-500 leading-relaxed max-w-2xl">Başvuru onaylanırsa, partnerden o an çekilmiş &apos;Canlı Doğrulama&apos; videosu veya özel pozlu fotoğrafı istenir.</p>
                 </div>
              </div>

              <div className="flex gap-10 items-start">
                 <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-rose-600 shrink-0 font-black italic text-2xl">03</div>
                 <div>
                    <h4 className="text-2xl font-black italic uppercase mb-2">Mühürleme</h4>
                    <p className="text-zinc-500 leading-relaxed max-w-2xl">Tüm veriler eşleştiğinde profile &apos;VIP VERIFIED&apos; mührü verilir ve sarsılmaz EscortVIP ağında yayına alınır.</p>
                 </div>
              </div>
           </div>
        </div>

        <section className="mt-40 text-center space-y-10">
           <h3 className="text-2xl font-black italic uppercase tracking-tighter">Sahte Profil Tespit Ettiniz mi?</h3>
           <p className="text-zinc-500 max-w-xl mx-auto">Eğer bir profilin doğrulama standartlarımıza uymadığını düşünüyorsanız, lütfen anında operasyon ekibimize bildirin. Topluluk güvenliği hepimizin sorumluluğundadır.</p>
           <div className="flex justify-center gap-10 opacity-60">
              <ImageIcon className="w-8 h-8" />
              <Video className="w-8 h-8" />
              <ShieldCheck className="w-8 h-8" />
           </div>
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10">
          <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            VERIFICATION PROTOCOL // istanbulescort.blog
          </div>
      </footer>
    </div>
  );
}
