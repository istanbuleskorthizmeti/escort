import Link from "next/link";
import { cities } from "@/lib/locations";
import { MapPin } from "lucide-react";

export default function NearbyDistricts({ citySlug, currentDistrictSlug }: { citySlug: string, currentDistrictSlug: string }) {
  const cityObj = cities[citySlug];
  if (!cityObj) return null;

  // Filter out the current district and pick up to 6 random/adjacent districts
  const otherDistricts = cityObj.districts.filter(d => d.slug !== currentDistrictSlug);
  
  // Predictably shuffle or just slice for horizontal interlinking
  const selectedDistricts = otherDistricts.slice(0, 6);

  if (selectedDistricts.length === 0) return null;

  return (
    <section className="mb-24 mt-20 border-t border-zinc-900 pt-16">
      <div className="flex flex-col items-center text-center mb-10">
        <MapPin className="w-6 h-6 text-rose-600 mb-4 animate-bounce" />
        <h3 className="text-2xl font-black italic uppercase text-white tracking-widest">
          {cityObj.name} Bölgesindeki Diğer VIP Lokasyonlar
        </h3>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2 max-w-xl">
          Arama motoru ve kullanıcı rota optimizasyonu için yatay navigasyon ağı.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {selectedDistricts.map((d) => (
          <Link
            key={d.slug}
            href={`/${citySlug}/${d.slug}`}
            className="bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-rose-600 hover:border-rose-600 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-glow-sm"
          >
            {d.name.replace(" VIP", "")}
          </Link>
        ))}
      </div>
    </section>
  );
}
