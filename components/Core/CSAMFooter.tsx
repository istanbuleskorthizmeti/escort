import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AlertTriangle, MessageCircle, Send, Users } from "lucide-react";

export default function CSAMFooter() {
  const { whatsappNumber } = siteConfig.contact;
  const formattedNumber = `+${whatsappNumber.slice(0, 2)} ${whatsappNumber.slice(2, 5)} ${whatsappNumber.slice(5, 8)} ${whatsappNumber.slice(8, 10)} ${whatsappNumber.slice(10, 12)}`;

  return (
    <footer className="w-full bg-[#050505] border-t border-zinc-900/50 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-600" />
            <h3 className="text-sm font-black tracking-widest uppercase text-rose-600 italic">
              CSAM Zero Tolerance Policy
            </h3>
          </div>
          <p className="text-xs text-zinc-500 font-sans leading-relaxed mb-4">
            VIPESCORTHIZMETI.COM has a strict, uncompromising zero-tolerance policy against Child Sexual Abuse Material (CSAM) and any form of human trafficking. We strictly comply with 18 U.S.C. § 2257, FOSTA-SESTA regulations, and international law. Any users, advertisers, or affiliates attempting to post, share, or request illegal content involving minors will be immediately reported to the National Center for Missing and Exploited Children (NCMEC) and relevant global law enforcement agencies (Interpol/Europol).
          </p>
          <p className="text-xs text-zinc-600 font-sans leading-relaxed">
            Sıfır Tolerans Politikamız: Platformumuzda çocuk istismarı materyallerine (CSAM) veya insan kaçakçılığına yönelik hiçbir faaliyete müsamaha gösterilmez. Bu tür içerikleri barındırma veya talep etme girişimleri anında küresel kolluk kuvvetlerine bildirilir.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-xs font-semibold tracking-widest text-zinc-500">
          <Link href="/about" className="hover:text-rose-600 transition-colors">Hakkımızda & Manifesto</Link>
          <Link href="/faq" className="hover:text-rose-600 transition-colors">Sıkça Sorulan Sorular</Link>
          <Link href="/contact" className="hover:text-rose-600 transition-colors">Güvenli İletişim</Link>
          <Link href="/dogrulama-protokolu" className="hover:text-rose-600 transition-colors">Doğrulama Protokolü</Link>
          <Link href="/katilim-protokolu" className="hover:text-rose-600 transition-colors">Ağa Katılın</Link>
          <Link href="/terms" className="hover:text-rose-600 transition-colors">Şartlar ve Koşullar</Link>
          <Link href="/privacy" className="hover:text-rose-600 transition-colors">Gizlilik Politikası</Link>
          <Link href="/18-usc-2257" className="hover:text-rose-600 transition-colors">18 U.S.C. § 2257 Uyum Beyanı</Link>
          
          <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-col gap-3">
            <a 
              href={siteConfig.contact.whatsappLink} 
              className="text-rose-600 hover:text-rose-500 transition-all font-black italic flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: {formattedNumber}
            </a>
            <a 
              href={siteConfig.contact.whatsappChannelLink} 
              className="text-green-500 hover:text-green-400 transition-all font-black italic flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Users className="w-4 h-4" />
              WhatsApp: Kanalı Takip Et
            </a>
            <a 
              href={siteConfig.contact.telegramGroupLink} 
              className="text-sky-500 hover:text-sky-400 transition-all font-black italic flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Send className="w-4 h-4" />
              Telegram: VIP GRUP
            </a>
          </div>

          <div className="mt-2 pt-4 border-t border-zinc-900">
            <span className="text-rose-600 font-black italic">RTA</span> / Restricted To Adults (18+)
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-900/50 text-center text-[10px] text-zinc-700 font-bold tracking-[0.2em] uppercase">
        © {new Date().getFullYear()} VIPESCORTHIZMETI.COM LUXURY CONCIERGE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
