import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { Sparkles, Download, ShieldCheck, Smartphone, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Mobil Uygulamayı İndir | EscortVIP App",
  description: "EscortVIP mobil uygulamasını indirerek, kaporasız VIP partnerlere kesintisiz, hızlı ve engelsiz bir şekilde doğrudan erişin.",
};

export default function DownloadAppPage() {
  const whatsappNumber = "+12495448982";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Merhaba, mobil uygulama üzerinden VIP randevu talebi oluşturmak istiyorum.")}`;

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6">
        <header className="mb-20 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-600/10 blur-[120px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/30 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> SECURE DOWNLOAD PORTAL
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase mb-6 leading-none">
            ESCORTVIP <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-600 to-rose-400">MOBİL UYGULAMA</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
            Erişim engellerine takılmadan, en yeni VIP profillere ve kaporasız güvenilir escort profillerine anında ulaşmak için resmi uygulamamızı cihazınıza yükleyin.
          </p>
        </header>

        {/* Dynamic Download Box */}
        <section className="space-y-12">
          <div className="bg-zinc-950/50 backdrop-blur-3xl border border-zinc-900 rounded-[3rem] p-8 md:p-12 hover:border-rose-600/30 transition-all shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">Version 2.4.1 (Stable Build)</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                  Android APK İndir
                </h2>
                <p className="text-xs text-zinc-400 max-w-md">
                  Uygulama paketimiz antivirüs taramalarından geçirilmiş olup, %100 güvenlidir. Bilgileriniz SSL şifreleme ve sıfır-kayıt politikamız ile tam koruma altındadır.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black px-10 py-5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all hover:scale-[1.02] shadow-xl"
                >
                  <Download className="w-4 h-4" /> APK Hemen Yükle
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-zinc-800 hover:border-rose-600/30 text-zinc-400 hover:text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-wider text-[11px] transition-all"
                >
                  <Smartphone className="w-4 h-4" /> Whatsapp Kurulum Desteği
                </a>
              </div>
            </div>

            {/* Features Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-zinc-900">
              <div className="space-y-2">
                <div className="text-rose-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> %100 Anonimlik
                </div>
                <p className="text-xs text-zinc-500">
                  Uygulama içi aramalar ve gezinme verileriniz cihazınızda şifrelenir, asla sunucularımızda saklanmaz.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-rose-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Hızlı Erişim
                </div>
                <p className="text-xs text-zinc-500">
                  Domain engellemelerinden ve tarayıcı yavaşlıklarından etkilenmeden tek tıkla VIP vitrinine ulaşın.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-rose-500 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-4 h-4" /> Kaporasız Randevu
                </div>
                <p className="text-xs text-zinc-500">
                  Uygulama üzerinden doğrudan profil sahiplerine WhatsApp ve arama ile anında, kaporasız randevu talebi.
                </p>
              </div>
            </div>
          </div>

          {/* Installation Manual */}
          <div className="border border-zinc-900 rounded-[2.5rem] p-8 md:p-12 space-y-8">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Info className="w-5 h-5 text-rose-500" /> Kurulum Kılavuzu
            </h3>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-extrabold flex items-center justify-center shrink-0 border border-zinc-800">
                  1
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">APK Dosyasını İndirin</h4>
                  <p className="text-xs text-zinc-500">
                    Yukarıdaki "APK Hemen Yükle" butonuna tıklayarak kurulum dosyasını cihazınıza indirin.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-extrabold flex items-center justify-center shrink-0 border border-zinc-800">
                  2
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">Bilinmeyen Kaynaklara İzin Verin</h4>
                  <p className="text-xs text-zinc-500">
                    Kuruluma başlamadan önce cihazınızın Ayarlar &gt; Güvenlik menüsünden "Bilinmeyen Kaynaklardan Uygulama Yükleme" seçeneğini aktif hale getirin.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-extrabold flex items-center justify-center shrink-0 border border-zinc-800">
                  3
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-white uppercase tracking-wide">iOS / Safari PWA Kurulumu</h4>
                  <p className="text-xs text-zinc-500">
                    iPhone kullanıcıları Safari tarayıcısı ile sitemizi ziyaret ettikten sonra "Paylaş" butonuna tıklayarak "Ana Ekrana Ekle" seçeneği ile uygulamayı anında yükleyebilir.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-zinc-900 mt-40 text-center opacity-30">
        <div className="text-[9px] font-black tracking-[1em] text-zinc-600 uppercase italic">
          ESCORTVIP MOBILE APP GROUP // 2026
        </div>
      </footer>
    </div>
  );
}
