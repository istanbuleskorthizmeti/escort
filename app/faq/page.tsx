import { Metadata } from "next";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";
import { HelpCircle, Shield, CreditCard, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | EscortVIP Destek Sistemi",
  description: "Ödeme süreçleri, gizlilik politikaları, rezervasyon detayları ve doğrulama standartları hakkında kapsamlı SSS.",
};

const FAQS = [
  {
    category: "GİZLİLİK & GÜVENLİK",
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        q: "Verilerim sisteminizde kaydediliyor mu?",
        a: "Hayır. EscortVIP 'Zero-Log' politikası uygular. İletişim geçmişiniz, IP adresiniz veya rezervasyon detaylarınız sunucularımızda asla saklanmaz. Tüm görüşmeler otomatik imha standartlarıne tabidir."
      },
      {
        q: "Panik Butonu nedir?",
        a: "Sayfanın sol alt köşesindeki kalkan simgesi, ekranınızı anında güvenli bir içeriğe (hava durumu vb.) yönlendirmek için tasarlanmıştır. Acil durumlarda hızlı gizlilik sağlar."
      }
    ]
  },
  {
    category: "ÖDEME & REZERVASYON",
    icon: <CreditCard className="w-5 h-5" />,
    items: [
      {
        q: "Ödemeyi nasıl yapıyorum?",
        a: "EscortVIP ağındaki temel kural yüz yüze nakit ödemedir. Ön ödeme, kapora veya dijital transfer (aksi belirtilmedikçe) talep edilmez. Bu, hem sizin hem de partnerin güvenliği içindir."
      },
      {
        q: "Hizmet iptali mümkün mü?",
        a: "Rezervasyonunuzu görüşme saatinden en az 2 saat önce bildirmek kaydıyla ücretsiz iptal edebilirsiniz. Karşılıklı zaman yönetimi ve prestij gereği bildirim yapmanızı önemle rica ederiz."
      }
    ]
  },
  {
    category: "DOĞRULAMA (VERIFICATION)",
    icon: <CheckCircle2 className="w-5 h-5" />,
    items: [
      {
        q: "Profillerin gerçek olduğunu nasıl anlarım?",
        a: "Sistemimizdeki profillerin %100'ü 'Doğrulama Standartları'nden geçer. Görseller günceldir ve fiziksel özellikler teyit edilmiştir. Sahte profil (fake) saptandığı an ilgili hesap ağdan süresiz ihraç edilir."
      },
      {
        q: "Nasıl VIP üye olabilirim?",
        a: "Düzenli rezervasyon yapan ve ağ kurallarına sadık kalan beyefendiler, belirli bir süre sonra otomatik olarak VIP listemize dahil edilir ve özel indirim/etkinlik hakları kazanırlar."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      {/* FAQ SCHEMA FOR RICH RESULTS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.flatMap(group => 
              group.items.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.a
                }
              }))
            )
          })
        }}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto py-32 px-6 md:px-12">
        <section className="text-center mb-24">
          <div className="inline-block bg-zinc-900 border border-zinc-800 text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-8">
            YARDIM MERKEZİ // SSS
          </div>
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
            SIKÇA <span className="text-rose-600">SORULAN</span> <br /> SORULAR.
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            EscortVIP deneyiminizi kusursuz hale getirmek için bilmeniz gereken her şey.
          </p>
        </section>

        <div className="space-y-24">
          {FAQS.map((group, idx) => (
            <div key={idx} className="space-y-12">
              <div className="flex items-center gap-4 border-b border-zinc-900 pb-6">
                 <div className="text-rose-600">{group.icon}</div>
                 <h2 className="text-xs font-black tracking-[0.4em] uppercase text-zinc-400">{group.category}</h2>
              </div>
              
              <div className="grid gap-12">
                {group.items.map((item, i) => (
                  <div key={i} className="group">
                    <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-rose-600 transition-colors">
                      {item.q}
                    </h3>
                    <p className="text-zinc-500 leading-relaxed font-medium pl-6 border-l border-zinc-800">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-40 bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 text-center group hover:border-rose-600/30 transition-all duration-700">
           <HelpCircle className="w-12 h-12 text-rose-600 mx-auto mb-6 opacity-40" />
           <h4 className="text-2xl font-bold italic uppercase tracking-tighter mb-4">Hala sorunuz mu var?</h4>
           <p className="text-zinc-500 text-sm mb-8">Destek ekibimiz 7/24 Telegram ve WhatsApp üzerinden sorularınızı yanıtlamaya hazırdır.</p>
           <a href="/contact" className="inline-block bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 hover:text-white transition-all">
            İletişime Geç
           </a>
        </section>
      </main>

      <PanicButton />
      <footer className="py-20 border-t border-zinc-900 mt-20 bg-zinc-950/80 text-center px-10">
          <div className="text-[10px] font-black tracking-[1em] text-zinc-700 uppercase italic">
            KNOWLEDGE BASE // istanbulescort.blog
          </div>
      </footer>
    </div>
  );
}
