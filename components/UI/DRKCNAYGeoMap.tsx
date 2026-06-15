import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

interface DRKCNAYGeoMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  width?: number | string;
  height?: number | string;
  locationName: string;
  iframeSrc?: string;
  placeId?: string;
}

export const DRKCNAYGeoMap: React.FC<DRKCNAYGeoMapProps> = ({
  lat,
  lng,
  zoom = 15,
  width = 600,
  height = 400,
  locationName,
  iframeSrc,
  placeId,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "AIzaSyCJrkR6g0LqhMj32rq6GT8dpmpUDskyqiQ";

  // Dark Mode / DRKCNAY ELITE Styling for Google Static Maps
  const styles = [
    'feature:all|element:labels.text.fill|color:0x9ca3af',
    'feature:all|element:labels.text.stroke|color:0x000000|lightness:13',
    'feature:administrative|element:geometry.fill|color:0x000000',
    'feature:administrative|element:geometry.stroke|color:0x144b53|lightness:14|weight:1.4',
    'feature:landscape|element:all|color:0x080808',
    'feature:poi|element:geometry|color:0x0c0c0c|lightness:5',
    'feature:road.highway|element:geometry.fill|color:0x000000',
    'feature:road.highway|element:geometry.stroke|color:0x0b434f|lightness:25',
    'feature:road.arterial|element:geometry.fill|color:0x000000',
    'feature:road.arterial|element:geometry.stroke|color:0x0b3d51|lightness:16',
    'feature:road.local|element:geometry|color:0x000000',
    'feature:transit|element:all|color:0x146474',
    'feature:water|element:all|color:0x021019'
  ].join('&style=');

  // Custom marker (Elite Orange)
  const marker = `markers=color:0xff8600%7C${lat},${lng}`;

  const mapUrl = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&${styles}&${marker}&key=${apiKey}`
    : '';

  // 🌍 If PlaceID is available, use the Embed API for maximum authority
  const embedUrl = placeId 
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=place_id:${placeId}`
    : iframeSrc;

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-zinc-900 group shadow-2xl" style={{ height: Number(height) }}>
      {embedUrl ? (
        <iframe 
          src={embedUrl} 
          width="100%" 
          height="100%" 
          style={{ border: 0, width: '100%', height: '100%' }} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full object-cover relative z-10"
        ></iframe>
      ) : apiKey ? (
        <Image
          src={mapUrl}
          alt={`${locationName} VIP Konum Haritası`}
          width={Number(width)}
          height={Number(height)}
          className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
          unoptimized 
        />
      ) : (
        <div className="w-full bg-zinc-950 flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-800 rounded-[2rem]" style={{ height: Number(height) }}>
          <MapPin className="w-12 h-12 text-[#ff8600] mb-4 animate-bounce" />
          <p className="text-zinc-500 font-medium italic text-center">
            {locationName} Koordinatları: {(Number(lat) || 0).toFixed(4)}, {(Number(lng) || 0).toFixed(4)}
            <br />
            <span className="text-[10px] text-zinc-700 mt-2 block uppercase tracking-widest">📍 GİZLİ VİP LOKASYON PROTOKOLÜ AKTİF</span>
          </p>
        </div>
      )}
      
      {/* Overlay VIP Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Location Badge */}
      {!embedUrl && (
        <div className="absolute bottom-6 left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-[#ff8600]/30 px-6 py-3 rounded-full z-20">
          <div className="w-2 h-2 bg-[#ff8600] rounded-full animate-pulse"></div>
          <span className="text-white text-xs font-black uppercase tracking-widest italic">{locationName}</span>
        </div>
      )}
    </div>
  );
};
