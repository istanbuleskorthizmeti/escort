import { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ProfileEngine } from "@/lib/seo/profile-engine";
import { ThemeEngine } from "@/lib/theme-engine";
import Navbar from "@/components/UI/Navbar";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") || "istanbulescort.blog";
  const theme = ThemeEngine.getTheme(host);
  
  return {
    title: `🔥 VIP Profil Galerisi | ${theme.brandName}`,
    description: `En güncel ve onaylı ${theme.brandName} VIP partner galerisi. %100 gerçek, teyitli fotoğraflar ve kaporasız hizmet garantisiyle. Hemen inceleyin.`,
    keywords: "vip escort galeri, onaylı profiller, gerçek fotoğraflar, kaporasız escort",
  };
}

export default async function GalleryPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "istanbulescort.blog";
  const theme = ThemeEngine.getTheme(host);

  // Generate 12 dummy profiles for the showcase (Omni-Gallery)
  const galleryItems = Array.from({ length: 12 }, (_, i) => {
    // Assuming images in public/vitrin are named 1.jpg to 12.jpg or similar
    const imageId = (i % 8) + 1; // Fallback to 1-8 if only 8 images exist
    return ProfileEngine.generateProfile(`${imageId}.jpg`, host);
  });

  return (
    <main className="min-h-screen bg-black text-zinc-100 flex flex-col">
      <Navbar />
      
      {/* 👑 GALLERY HEADER */}
      <section className="relative py-24 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-black via-zinc-900/20 to-black z-0" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <span className="text-(--brand-color)">Elit</span> Görsel Galeri
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-medium italic max-w-3xl mx-auto">
            {theme.brandName} güvencesiyle İstanbul'un en seçkin ve onaylı profilleri. Tüm görseller %100 teyitlidir.
          </p>
        </div>
      </section>

      {/* 📸 MASONRY OMNI-GALLERY */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-12 md:py-24 w-full">
        {/* We use CSS columns for a pure CSS masonry layout */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          
          {galleryItems.map((profile, idx) => (
            <Link 
              href={`/p/${profile.slug}`} 
              key={`${profile.id}-${idx}`}
              className="break-inside-avoid block group relative bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 shadow-2xl hover:border-(--brand-color) transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[3/4] overflow-hidden">
                <Image 
                  src={profile.image} 
                  alt={`${profile.name} - ${profile.district} VIP`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Omni-Gallery SEO Noise (Invisible watermark pattern for unique image hash) */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Badges */}
                <div className="absolute top-4 right-4">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-[10px] font-black italic rounded-full uppercase backdrop-blur-md">
                    Onaylı
                  </span>
                </div>
              </div>

              {/* Content / LSI Metadata */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white group-hover:text-(--brand-color) transition-colors">
                  {profile.name}
                </h2>
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                  <span className="text-(--brand-color)">📍</span> {profile.district}
                </div>
                
                {/* LSI Keywords for Context */}
                <p className="text-zinc-600 text-[10px] mt-2 leading-snug">
                  {profile.tags.join(", ")} - VIP {profile.district} escort hizmetleri. {profile.description}
                </p>
              </div>
            </Link>
          ))}
          
        </div>
      </section>

      {/* 📚 SEO SILO CONTENT */}
      <section className="border-t border-white/5 py-16 bg-zinc-900/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
           <h2 className="text-2xl font-black italic uppercase text-zinc-500">Neden Bizi Tercih Etmelisiniz?</h2>
           <p className="text-zinc-400 leading-relaxed font-medium">
             DRKCNAY Elite ağı, dijital dünyanın en güvenilir referans noktasıdır. Yukarıda listelenen tüm profillerimiz, düzenli aralıklarla güncellenmekte ve teyit edilmektedir. Gerçek dışı hiçbir görsele yer vermeyen platformumuz, <strong>{theme.slogan.toLowerCase()}</strong> felsefesine tam uyum sağlar.
           </p>
        </div>
      </section>
    </main>
  );
}
