import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ProfileEngine } from "@/lib/seo/profile-engine";
import { ThemeEngine } from "@/lib/theme-engine";
import Navbar from "@/components/UI/Navbar";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "istanbulescort.blog";
  
  const profile = ProfileEngine.generateProfile(`${slug}.jpg`, host);
  
  return {
    title: profile.title,
    description: profile.description,
    keywords: profile.tags.join(", "),
    openGraph: {
      title: profile.title,
      description: profile.description,
      images: [profile.image],
    }
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const host = headersList.get("host") || "istanbulescort.blog";
  
  const theme = ThemeEngine.getTheme(host);
  const profile = ProfileEngine.generateProfile(`${slug}.jpg`, host);
  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* 🧠 OMNI-GALLERY SCHEMA INJECTION */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Person",
                "name": profile.name,
                "description": profile.description,
                "image": {
                  "@type": "ImageObject",
                  "url": `https://${host}${profile.image}`,
                  "contentLocation": {
                    "@type": "Place",
                    "name": `${profile.district}, İstanbul`
                  },
                  "author": {
                    "@type": "Organization",
                    "name": theme.brandName
                  }
                },
                "jobTitle": "VIP Partner",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": profile.district,
                  "addressRegion": "İstanbul",
                  "addressCountry": "TR"
                }
              },
              {
                "@type": "Service",
                "name": `${profile.district} VIP Escort Hizmeti`,
                "provider": {
                  "@type": "Person",
                  "name": profile.name
                },
                "areaServed": {
                  "@type": "City",
                  "name": profile.district
                }
              }
            ]
          })
        }}
      />
      
      <Navbar />
      
      <section className="flex-1 max-w-5xl mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* 🖼️ VIP VISUAL SHOWCASE */}
          <div className="relative aspect-[3/4] w-full group overflow-hidden shadow-glow-sm" style={{ borderRadius: 'var(--radius-base)' }}>
             <Image 
                src={profile.image} 
                alt={profile.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
             />
             <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
             <div className="absolute bottom-6 left-6">
                <span className="bg-[var(--brand-color)] text-white px-4 py-1 text-xs font-black italic rounded-full shadow-lg uppercase">
                  %100 Gerçek Profil
                </span>
             </div>
          </div>

          {/* 📝 ELITE PROFILE INFO */}
          <div className="space-y-8">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-none">
                <span className="text-white uppercase">{profile.name}</span>
                <br />
                <span className="text-[var(--brand-color)] uppercase">{profile.district} VIP</span>
              </h1>
              <p className="text-xl text-zinc-400 font-medium italic opacity-80 leading-relaxed">
                {profile.description}
              </p>
            </header>

            <div className="flex flex-wrap gap-3">
              {profile.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="p-8 bg-zinc-900/50 backdrop-blur-3xl border border-white/5 rounded-3xl space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-zinc-500 font-bold uppercase text-xs tracking-tighter">Lokasyon</span>
                <span className="text-white font-black italic">{profile.district} / İstanbul</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-zinc-500 font-bold uppercase text-xs tracking-tighter">Kategori</span>
                <span className="text-white font-black italic">VIP Partner</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-bold uppercase text-xs tracking-tighter">Doğrulama</span>
                <span className="text-emerald-500 font-black italic uppercase">Onaylı Fotoğraf</span>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex flex-col gap-4">
                <a 
                  href="https://dorukcanay.digital/go"
                  className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-5 rounded-full font-black italic text-xl shadow-[0_0_40px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                  WHATSAPP İLE ULAŞ
                </a>
                <Link 
                  href="/standart" 
                  className="block w-full text-center bg-zinc-900 border border-white/10 text-zinc-300 py-4 rounded-full font-bold italic text-lg hover:bg-zinc-800 transition-all"
                >
                  GÜVENLİK PROTOKOLÜ
                </Link>
              </div>
              <p className="text-center mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Kaporasız and Güvenilir Hizmet Garantisi
              </p>
            </div>
          </div>
        </div>

        {/* 📚 DEEP SEO CONTENT FACTORY */}
        <div className="mt-24 pt-24 border-t border-white/5 prose prose-invert max-w-none">
          <h2 className="text-3xl font-black italic tracking-tighter text-white mb-12">
             {profile.district} Bölgesinde Elit Deneyim: {profile.name}
          </h2>
          <div className="text-zinc-400 text-lg leading-relaxed space-y-6 font-medium">
             {profile.content.split('\n').map((para, i) => (
               para.trim() && <p key={i}>{para.trim()}</p>
             ))}
          </div>
          
          <div className="mt-12 p-10 bg-zinc-900/30 border border-white/5 rounded-3xl italic text-zinc-500 leading-relaxed text-sm">
             <strong>Editörün Notu:</strong> {theme.brandName} olarak sunduğumuz tüm hizmetlerde olduğu gibi, {profile.name} profilimiz de gizlilik ve kalite standartlarımıza %100 uyumludur. {theme.slogan} anlayışımızla, İstanbul'un en seçkin bölgelerinde siz değerli misafirlerimizi ağırlamaktan mutluluk duyarız.
          </div>
        </div>
      </section>
    </main>
  );
}
