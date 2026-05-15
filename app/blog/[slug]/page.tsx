import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";
import { siteConfig } from "@/config/site";
import { defaultAdmin } from "@/config/admins";
import Navbar from "@/components/UI/Navbar";
import { PanicButton } from "@/components/UI/ConciergeSuite";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const currentYear = new Date().getFullYear();
  const headersList = await headers();
  const host = headersList.get("host") || siteConfig.domain;
  
  if (!post) {
    const formattedSlug = slug.replace(/-/g, ' ').toUpperCase();
    return { title: `📰 ${formattedSlug} | ELİT BLOG İNCELEMESİ | DRKCNAY ${new Date().getFullYear()}` };
  }

  const title = `🔥 ${post.title} | ${currentYear} Elit Rehber | DRKCNAY`;
  const description = `${post.excerpt} %100 gizlilik ve elit standartlarla ${currentYear} VIP escort dünyasını keşfedin.`;

  return {
    title,
    description,
    keywords: post.seoKeywords,
    alternates: {
      canonical: `https://${host}/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://${host}/blog/${slug}`,
      type: 'article',
      images: ['/dorukcanay_angel_luxury_icon_1777791859121.png']
    }
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const waMessage = encodeURIComponent(`Merhaba, "${post.title}" yazınızı okudum ve rezervasyon standartları hakkında bilgi almak istiyorum.`);
  const waLink = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${waMessage}`;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-rose-600 selection:text-white antialiased">
      {/* Görünmez Article Şeması (SEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Person", name: post.author },
            datePublished: post.date,
            publisher: { "@type": "Organization", name: "EscortVIP Elit" }
          })
        }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto py-24 px-6 md:px-12">
        <nav className="mb-12 flex items-center gap-4 text-[10px] font-black tracking-widest text-zinc-500 italic uppercase bg-zinc-950/50 p-6 rounded-full border border-zinc-900 w-fit">
           <Link href="/" className="hover:text-rose-600 transition-colors">Ana Sayfa</Link>
           <span>/</span>
           <Link href="/blog" className="hover:text-rose-600 transition-colors">Külliyat</Link>
           <span>/</span>
           <span className="text-zinc-700 truncate max-w-[200px]">{post.title}</span>
        </nav>

        <article className="mb-20">
          <header className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-900 pb-8">
               <span>Kategori: <span className="text-rose-600">{post.category}</span></span>
               <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
               <span>Yazar: {post.author}</span>
               <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
               <span>Şifreleme Aktif</span>
            </div>
          </header>

          <div className="prose prose-invert prose-rose max-w-none text-zinc-300 font-medium leading-loose md:text-lg">
             {/* İçerik markdown/string olarak geldiği için basit paragraflara ayırma */}
             {post.content.split('\n').map((paragraph, idx) => {
               if (paragraph.trim().startsWith('###')) {
                 return <h3 key={idx} className="text-2xl md:text-3xl font-black italic uppercase text-white mt-12 mb-6 tracking-tight">{paragraph.replace('###', '').trim()}</h3>
               }
               return paragraph.trim() ? <p key={idx} className="mb-6">{paragraph.trim()}</p> : null;
             })}
          </div>
        </article>

        {/* Call To Action - Booking */}
        <section className="bg-zinc-950 border border-rose-900/30 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-rose-600 to-transparent"></div>
          <h2 className="text-2xl font-black italic uppercase mb-4 text-white">Bu Standartları Gerçekliğe Taşıyın</h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Okuduğunuz VIP hizmetlerin tamamı sistemimizde canlı ve Onaylı profillerle sunulmaktadır. %100 Sıfır İz (Tam Gizlilik) garantisiyle rezervasyonunuzu başlatın.</p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
            {defaultAdmin.name} ile İletişime Geç
          </a>
        </section>
      </main>

      <PanicButton />
    </div>
  );
}
