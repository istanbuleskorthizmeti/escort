"use client";

import { useEffect, useState, useCallback } from "react";
import { Zap, ShieldCheck, Heart, UserCheck, MessageSquare, Eye } from "lucide-react";
import { cn } from "../../lib/utils";

// 81 şehirden otonom lokasyon havuzu
const LOCATION_POOL = [
  { neighborhood: "Bebek", district: "Beşiktaş", city: "İstanbul" },
  { neighborhood: "Çukurambar", district: "Çankaya", city: "Ankara" },
  { neighborhood: "Mavişehir", district: "Karşıyaka", city: "İzmir" },
  { neighborhood: "Lara", district: "Muratpaşa", city: "Antalya" },
  { neighborhood: "Özlüce", district: "Nilüfer", city: "Bursa" },
  { neighborhood: "Pozcu", district: "Yenişehir", city: "Mersin" },
  { neighborhood: "Batıkent", district: "Tepebaşı", city: "Eskişehir" },
  { neighborhood: "İbrahimli", district: "Şehitkamil", city: "Gaziantep" },
  { neighborhood: "Atakum", district: "Atakum", city: "Samsun" },
  { neighborhood: "Beşyol", district: "İpekyolu", city: "Van" },
  { neighborhood: "Bodrum Merkez", district: "Bodrum", city: "Muğla" },
  { neighborhood: "Bahçelievler", district: "Merkez", city: "Tekirdağ" },
  { neighborhood: "Yıldızlar", district: "Merkez", city: "Sivas" },
  { neighborhood: "Yenimahalle", district: "Merkez", city: "Kayseri" },
  { neighborhood: "Yomra", district: "Merkez", city: "Trabzon" },
  { neighborhood: "Aydınlık", district: "Selçuklu", city: "Konya" },
  { neighborhood: "Bağlar", district: "Bağlar", city: "Diyarbakır" },
] as const;

const AGENTS = ["S. Executive", "Dr. D. Ay", "Eda Nur", "Elite Agent"] as const;

interface ActionItem {
  text: string;
  icon: React.ReactNode;
  badge: string;
  glow: string;
}

type TemplateDefinition = {
  text: string;
  icon: React.ReactNode;
  badge: string;
  glow: string;
};

const ACTION_TEMPLATES: TemplateDefinition[] = [
  {
    text: "{city} / {neighborhood} — Yeni VIP profil doğrulandı.",
    icon: <UserCheck className="w-5 h-5 text-green-400" />,
    badge: "DOĞRULANMIŞ",
    glow: "shadow-[0_0_30px_-5px_rgba(74,222,128,0.15)]",
  },
  {
    text: "{agent} ile {city} özel konsültasyon başladı.",
    icon: <MessageSquare className="w-5 h-5 text-rose-400" />,
    badge: "GİZLİ SEANS",
    glow: "shadow-[0_0_30px_-5px_rgba(225,29,72,0.15)]",
  },
  {
    text: "{neighborhood} / {district} — Lüks randevu onaylandı.",
    icon: <Heart className="w-5 h-5 text-red-400" />,
    badge: "AKTİF KOD",
    glow: "shadow-[0_0_30px_-5px_rgba(248,113,113,0.15)]",
  },
  {
    text: "Elit ağında güvenlik standartları güncellendi.",
    icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
    badge: "SİSTEM GÜVENLİ",
    glow: "shadow-[0_0_30px_-5px_rgba(96,165,250,0.15)]",
  },
  {
    text: "{city} / {district} — Yeni katalog yayınlandı.",
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    badge: "YENİ PROFİLLER",
    glow: "shadow-[0_0_30px_-5px_rgba(250,204,21,0.15)]",
  },
  {
    text: "{neighborhood} profiline {count} anlık görüntüleme.",
    icon: <Eye className="w-5 h-5 text-purple-400" />,
    badge: "CANLI TAKİP",
    glow: "shadow-[0_0_30px_-5px_rgba(192,132,252,0.15)]",
  },
];

export function FOMONotifier() {
  const [current, setCurrent] = useState<ActionItem | null>(null);
  const [visible, setVisible] = useState(false);

  const generateRandomAction = useCallback((): ActionItem => {
    const template = ACTION_TEMPLATES[Math.floor(Math.random() * ACTION_TEMPLATES.length)];
    const loc = LOCATION_POOL[Math.floor(Math.random() * LOCATION_POOL.length)];
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const count = Math.floor(Math.random() * 40 + 8);

    const text = template.text
      .replace("{city}", loc.city)
      .replace("{neighborhood}", loc.neighborhood)
      .replace("{district}", loc.district)
      .replace("{agent}", agent)
      .replace("{count}", String(count));

    return { icon: template.icon, badge: template.badge, glow: template.glow, text };
  }, []);

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout>;
    let nextTimeout: ReturnType<typeof setTimeout>;
    let firstTimeout: ReturnType<typeof setTimeout>;

    const schedule = () => {
      firstTimeout = setTimeout(() => {
        setCurrent(generateRandomAction());
        setVisible(true);

        hideTimeout = setTimeout(() => {
          setVisible(false);
          const gap = Math.random() * 15_000 + 10_000; // 10–25 sn arası
          nextTimeout = setTimeout(schedule, gap);
        }, 6_000);
      }, 5_000);
    };

    schedule();
    return () => {
      clearTimeout(firstTimeout);
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [generateRandomAction]);

  if (!current) return null;

  return (
    <div
      className={cn(
        "fixed top-24 left-1/2 -translate-x-1/2 md:top-auto md:bottom-28 md:left-auto md:right-6 md:translate-x-0 z-[140] w-[90%] md:w-[340px] max-w-[400px] transition-all duration-700 transform",
        visible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-90 pointer-events-none"
      )}
    >
      <div
        className={cn(
          "bg-black/92 backdrop-blur-3xl border border-zinc-800/80 overflow-hidden relative group rounded-2xl",
          current.glow
        )}
      >
        {/* Üst kenar parıltısı */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-rose-600/60 to-transparent" />
        {/* Sol vurgu çizgisi */}
        <div className="absolute top-0 left-0 w-0.5 h-full bg-rose-600" />

        <div className="p-4 flex gap-4 items-center">
          <div className="w-11 h-11 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 group-hover:border-rose-600/40 transition-colors shrink-0">
            {current.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[8px] font-black tracking-[0.2em] text-rose-500 uppercase italic mb-1">
              {current.badge} · CANLI
            </div>
            <p className="text-zinc-200 text-[11px] font-bold leading-snug line-clamp-2">
              {current.text}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_6px_#4ade80]" />
              <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                Az önce
              </span>
            </div>
          </div>

          <button
            onClick={() => setVisible(false)}
            aria-label="Bildirimi kapat"
            className="text-zinc-700 hover:text-zinc-400 transition-colors self-start shrink-0 ml-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
