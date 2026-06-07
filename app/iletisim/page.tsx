import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { Mail, MessageCircle, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim | EscortVIP Destek Departmanı",
  description: "Öneri, şikayet, reklam başvuruları ve telif hakkı bildirimleriniz için iletişim kanallarımız ve çalışma saatlerimiz.",
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <section className="text-center mb-24">
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-8">
            DESTEK MERKEZİ // ILETISIM
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
            BİZİMLE <span className="text-rose-600">İLETİŞİME</span> <br /> GEÇİN.
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Sorularınız, iş ortaklığı talepleriniz veya telif hakları bildirimleriniz için resmi kanallarımız.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-zinc-950/50 border border-zinc-900 p-10 rounded-[3rem] hover:border-rose-600/30 transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">E-Posta Adresi</h3>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">Telif hakkı bildirimleri, hukuki yazışmalar ve resmi reklam başvuruları için.</p>
            </div>
            <a href="mailto:info@dorukcanay.digital" className="text-white font-bold text-lg hover:text-rose-600 transition-colors">
              info@dorukcanay.digital
            </a>
          </div>

          <div className="bg-zinc-950/50 border border-zinc-900 p-10 rounded-[3rem] hover:border-rose-600/30 transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-rose-600/10 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Canlı Destek</h3>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">Hızlı soru-cevap, anlık teknik bildirimler ve VIP üyelik danışmanlığı için.</p>
            </div>
            <a href="https://t.me/dorukcanay" target="_blank" rel="noopener noreferrer" className="text-white font-bold text-lg hover:text-rose-600 transition-colors">
              t.me/dorukcanay
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-950/30 border border-zinc-900 rounded-[3rem] p-10">
          <div className="flex items-center gap-6">
            <Clock className="w-10 h-10 text-rose-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase text-zinc-400">Çalışma Saatleri</h4>
              <p className="text-xs text-zinc-500 mt-1">E-Posta talepleri 24-48 saat içerisinde, Telegram mesajları ise anında yanıtlanır.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <ShieldCheck className="w-10 h-10 text-rose-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-black uppercase text-zinc-400">Uçtan Uca Gizlilik</h4>
              <p className="text-xs text-zinc-500 mt-1">Yapılan tüm yazışmalar ve paylaşılan bilgiler "Zero-Log" standartları altında imha edilir.</p>
            </div>
          </div>
        </div>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10">
          <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            EscortVIP.net // THE DRKCNAY SYSTEM
          </div>
      </footer>
    </div>
  );
}
