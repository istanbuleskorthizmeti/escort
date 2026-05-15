import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { siteConfig } from "@/config/site";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { MessageSquare, Send, Bell, ShieldAlert } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "İletişim | EscortVIP Güvenli Erişim Hattı",
  description: "VIP rezervasyon ve destek için şifreli iletişim kanallarımız. WhatsApp ve Telegram üzerinden anlık erişim.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto py-32 px-6 md:px-12">
        <section className="text-center mb-24">
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-8">
            İLETİŞİM // SECURE ACCESS
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
            HIZLI VE <br /><span className="text-rose-600">GİZLİ</span> ERİŞİM.
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Sıfır-İz politikamız gereği geleneksel formları kullanmıyoruz. Tüm iletişim şifreli uçtan uca altyapılar üzerinden yürütülür.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
           {/* WhatsApp Central */}
           <Link 
            href={siteConfig.contact.whatsappLink}
            target="_blank"
            className="group block bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 transition-all duration-700 hover:border-green-600/50 hover:bg-green-600/5 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white">WhatsApp Hattı</h3>
              <p className="text-zinc-500 text-sm font-medium mb-12 max-w-[240px]">Rezervasyon talepleri, yeni profil teyitleri ve anlık konum bilgisi için ana iletişim kanalımız.</p>
              <div className="inline-flex items-center gap-4 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] group-hover:bg-green-600 group-hover:text-white transition-all">
                Sohbeti Başlat <span className="text-lg">→</span>
              </div>
           </Link>

           {/* WhatsApp Channel */}
           <Link 
            href={siteConfig.contact.whatsappChannelLink}
            target="_blank"
            className="group block bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 transition-all duration-700 hover:border-green-500/50 hover:bg-green-500/5 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquare className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white">WhatsApp Kanalı</h3>
              <p className="text-zinc-500 text-sm font-medium mb-12 max-w-[240px]">Günlük güncellemeler, yeni katılan profiller ve sınırlı kampanyalar için resmi WhatsApp kanalımız.</p>
              <div className="inline-flex items-center gap-4 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] group-hover:bg-green-500 group-hover:text-white transition-all">
                Kanalı Takip Et <span className="text-lg">→</span>
              </div>
           </Link>

           {/* Telegram VIP */}
           <Link 
            href={siteConfig.contact.telegramGroupLink}
            target="_blank"
            className="group block bg-zinc-950 border border-zinc-900 rounded-[3rem] p-10 transition-all duration-700 hover:border-sky-500/50 hover:bg-sky-500/5 relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Send className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white">Telegram VIP</h3>
              <p className="text-zinc-500 text-sm font-medium mb-12 max-w-[240px]">Üst düzey gizlilik, topluluk güncellemeleri ve VIP duyurular için şifreli kanalımız.</p>
              <div className="inline-flex items-center gap-4 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] group-hover:bg-sky-500 group-hover:text-white transition-all">
                Kanala Katıl <span className="text-lg">→</span>
              </div>
           </Link>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-zinc-900 pt-32">
            <div className="space-y-4">
               <div className="text-rose-600 mb-6">
                 <Bell className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-bold italic uppercase tracking-tighter">İş Ortaklığı</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">Reklam, kurumsal işbirlikleri veya franchise talepleri için Telegram üzerinden &quot;Executive&quot; birimiyle temasa geçin.</p>
            </div>

            <div className="space-y-4">
               <div className="text-rose-600 mb-6">
                 <ShieldAlert className="w-10 h-10" />
               </div>
               <h4 className="text-xl font-bold italic uppercase tracking-tighter">Güvenlik İhbarı</h4>
               <p className="text-zinc-500 text-sm leading-relaxed">Adımıza açılmış sahte sayfaları veya şüpheli durumları bildirmek için lütfen 7/24 operatör hattımızla paylaşın.</p>
            </div>

            <div className="bg-zinc-950/80 border border-rose-600/20 p-10 rounded-[2.5rem] flex flex-col justify-center">
               <span className="text-rose-600 text-[10px] font-black tracking-widest uppercase mb-2">Önemli Not</span>
               <p className="text-zinc-400 text-xs font-medium italic leading-relaxed">
                Tüm görüşmelerimiz otomatik olarak 24 saat içinde silinmektedir. Gizliliğiniz bizim için kutsaldır.
               </p>
            </div>
        </section>

        {/* GBP VERIFICATION & LOCAL SEO SECTION */}
        <section className="mt-32 pt-20 border-t border-zinc-900">
           <div className="bg-zinc-950 border border-zinc-900 p-12 rounded-[3rem] text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-6">
                Kurumsal <span className="text-rose-600">İrtibat Ofisi</span>
              </h2>
              <p className="text-zinc-500 text-sm mb-8">
                Hukuki tebligatlar ve resmi kurumsal yazışmalar için kayıtlı ofis adresimiz. Müşteri kabulü sadece randevu ile sağlanmaktadır.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="bg-black/50 border border-zinc-800 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-rose-500 mb-2">Güneşli Eskor T</h3>
                    <p className="text-zinc-400 font-medium">Güneşli, Fevzi Çakmak Cd No:6</p>
                    <p className="text-zinc-400 font-medium">34212 Bağcılar / İstanbul</p>
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                       <span className="text-xs text-rose-600 font-bold uppercase tracking-widest">🛡️ Kurumsal Onaylı</span>
                    </div>
                 </div>

                 <div className="bg-black/50 border border-zinc-800 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold text-rose-500 mb-2">Esenyurt Eskor T</h3>
                    <p className="text-zinc-400 font-medium">Yunus Emre, Mandıra Cd. No:96/1</p>
                    <p className="text-zinc-400 font-medium">34510 Esenyurt / İstanbul</p>
                    <div className="mt-4 pt-4 border-t border-zinc-800">
                       <span className="text-xs text-rose-600 font-bold uppercase tracking-widest">🛡️ Kurumsal Onaylı</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* JSON-LD Schema for Local SEO / GBP Verification */}
           <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify([
                  {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "Güneşli Eskor T",
                    "image": `https://${siteConfig.domain}/images/districts/bagcilar.png`,
                    "@id": `https://${siteConfig.domain}/contact#gunesli-office`,
                    "url": `https://${siteConfig.domain}/contact`,
                    "telephone": "+905520949245",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "Güneşli, Fevzi Çakmak Cd No:6",
                      "addressLocality": "Bağcılar",
                      "addressRegion": "İstanbul",
                      "postalCode": "34212",
                      "addressCountry": "TR"
                    },
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": 41.0336,
                      "longitude": 28.8211
                    },
                    "department": {
                      "@type": "LocalBusiness",
                      "name": "DRKCNAY Executive Management",
                      "telephone": "+905520949245"
                    }
                  },
                  {
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": "Esenyurt Eskor T",
                    "image": `https://${siteConfig.domain}/images/districts/esenyurt.png`,
                    "@id": `https://${siteConfig.domain}/contact#esenyurt-office`,
                    "url": `https://${siteConfig.domain}/contact`,
                    "telephone": "+905520949245",
                    "address": {
                      "@type": "PostalAddress",
                      "streetAddress": "Yunus Emre, Mandıra Cd. No:96/1",
                      "addressLocality": "Esenyurt",
                      "addressRegion": "İstanbul",
                      "postalCode": "34510",
                      "addressCountry": "TR"
                    },
                    "geo": {
                      "@type": "GeoCoordinates",
                      "latitude": 41.0343,
                      "longitude": 28.6811
                    },
                    "department": {
                      "@type": "LocalBusiness",
                      "name": "DRKCNAY Executive Management",
                      "telephone": "+905520949245"
                    }
                  }
                ])
              }}
           />
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10">
          <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            SECURE ACCESS // VIPESCORTHIZMETI.COM
          </div>
      </footer>
    </div>
  );
}
