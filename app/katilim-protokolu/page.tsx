import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { siteConfig } from "@/config/site";
import { PanicButton, VerificationBadge } from "@/components/UI/ConciergeSuite";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Elit Katılım Standartları | Tam Gizlilik Partner Ağı",
  description: "EscortVIP elit partner ağına katılım. Güvenli, şifreli ve sunucu loglamasız başvuru sistemi.",
};

export default function RecruitmentProtocolPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6 md:px-12">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <VerificationBadge />
          </div>
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full mb-6 relative overflow-hidden">
             <span className="relative z-10"><span className="text-green-500 mr-2">●</span>END-TO-END ENCRYPTED</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
            Elite <span className="text-rose-600">Network</span> Başvurusu
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
            EscortVIP bünyesindeki elit beylerle güvenli şartlar altında bir araya gelmek isteyen hanımefendiler için oluşturulmuş &quot;Sıfır İz (Tam Gizlilik)&quot; başvuru portalındasınız. Bu sayfadaki hiçbir hareketiniz sunucularımızda kaydedilmez (Log-free).
          </p>

          <div className="flex flex-wrap justify-center gap-10 mt-12 opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Offshore Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">256-bit AES</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-rose-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">No Log Policy</span>
              </div>
          </div>
        </div>

        <section className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/5 blur-[100px] rounded-full pointer-events-none"></div>
           
           <div className="space-y-12 relative z-10">
             
             {/* Security Warn */}
             <div className="bg-black/50 border border-rose-900/30 rounded-2xl p-6 flex gap-4 items-start">
               <div className="text-rose-600 mt-1">
                 <svg xmlns="http://www.w3.org/2005/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
               </div>
               <div>
                  <h3 className="text-rose-500 font-black tracking-widest text-xs uppercase mb-2">Güvenlik Standartları Aktif</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">Başvurunuzu incelerken medyanızı veya bilgilerinizi asla yerel sunucularda tutmuyoruz. E-posta formları yerine, 3. parti offshore (yurtdışı) şifreli Telegram Asistanımız üzerinden iletişim kuruyoruz.</p>
               </div>
             </div>

             {/* Application Steps */}
             <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-rose-600 shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-bold italic mb-2">Gizli (Secret) Telegram Başlatın</h4>
                    <p className="text-zinc-500 text-sm">Aşağıdaki butona tıklayarak EscortVIP Resmi Başvuru Botuna yönlendirileceksiniz. Kendi ana hesabınız yerine gizli bir hesap kullanmanızı öneririz.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-rose-600 shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-bold italic mb-2">Doğrulama (Yüz Gizleme Opsiyonu)</h4>
                    <p className="text-zinc-500 text-sm">Yaş, Fizik (Boy/Kilo) ve hizmet vermek istediğiniz il/ilçeyi bota gönderin. Görsellerde yüzünüzü gizleme hakkınız bulunmaktadır.</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-rose-600 shrink-0">3</div>
                  <div>
                    <h4 className="text-xl font-bold italic mb-2">Ağa Dahil Olma & Müşteri Karşılama</h4>
                    <p className="text-zinc-500 text-sm">Profiliniz onaylandığında, vitrinimize sizin adınıza özel bir sayfa açılır ve sadece elit, teyitli müşterilerin görüşmeleri size şifreli olarak iletilir.</p>
                  </div>
                </div>
             </div>

             <div className="pt-6">
               <a 
                 href={`https://t.me/${siteConfig.contact.telegramHandle}_apply`} // Bu kısım offshore bot handle'ı olmalı
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="block w-full text-center bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all hover:scale-[1.01]"
               >
                 Şifreli Telegram Botunu Başlat
               </a>
             </div>

           </div>
        </section>
      </main>
      <PanicButton />
    </div>
  );
}
