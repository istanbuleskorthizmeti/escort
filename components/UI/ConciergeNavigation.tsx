import Link from "next/link";
import { cities } from "@/lib/locations";

interface NavProps {
  city: string;
  district?: string;
  neighborhood?: string;
}

export function DRKCNAYNavigation({ city, district, neighborhood }: NavProps) {
  const cityObj = cities[city.toLowerCase()];
  if (!cityObj) return null;

  const dObj = district ? cityObj.districts.find(d => d.slug === district.toLowerCase()) : null;

  return (
    <nav className="mt-32 pt-20 border-t border-zinc-900">
      <div className="space-y-16">
        <div className="text-center">
          <h3 className="text-sm font-black tracking-[0.5em] text-rose-600 uppercase mb-8 italic">
            Elit NAVIGATION MATRIX
          </h3>
        </div>

        {/* Hiyerarşik Link Grupları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* Şehir Odaklı Linkler */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
              Kritik Şehir Hubları
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {Object.values(cities).map(c => (
                <Link 
                  key={c.slug} 
                  href={`/${c.slug}`}
                  className={`text-[11px] font-bold uppercase transition-colors ${c.slug === city ? 'text-rose-600' : 'text-zinc-400 hover:text-white'}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          {/* İlçe Odaklı Linkler (Şehir sayfasındaysa tüm ilçeler, ilçe/mahalle sayfasındaysa kardeş ilçeler) */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
              {cityObj.name} Bölge Protokolleri
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {cityObj.districts.map(d => (
                <Link 
                  key={d.slug} 
                  href={`/${city}/${d.slug}`}
                  className={`text-[11px] font-bold uppercase transition-colors ${d.slug === district ? 'text-rose-600' : 'text-zinc-400 hover:text-white'}`}
                >
                  {d.name.replace(" VIP", "")}
                </Link>
              ))}
            </div>
          </div>

          {/* Mahalle Odaklı Linkler (İlçe veya Mahalle sayfasındaysa) */}
          {(dObj) && (
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                {dObj.name.replace(" VIP", "")} Lokal Hublar
              </h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {dObj.neighborhoods.map(n => (
                  <Link 
                    key={n.slug} 
                    href={`/${city}/${district}/${n.slug}`}
                    className={`text-[11px] font-bold uppercase transition-colors ${n.slug === neighborhood ? 'text-rose-600' : 'text-zinc-400 hover:text-white'}`}
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Brand Authority Footer */}
        <div className="pt-20 text-center">
            <p className="text-[9px] font-black tracking-[1em] text-zinc-800 uppercase italic opacity-30">
              Escortvip.net Elit Architecture © 2026
            </p>
        </div>
      </div>
    </nav>
  );
}
