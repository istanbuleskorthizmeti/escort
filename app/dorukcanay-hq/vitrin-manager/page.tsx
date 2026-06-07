"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AdProfile {
  id: string;
  name: string;
  age: number;
  phone: string;
  image: string;
  tier: string;
  isActive: boolean;
  features: string[];
}

export default function VitrinManager() {
  const [profiles, setProfiles] = useState<AdProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState("20");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("/assets/img/seo_0_pinterest_aesthetic_1.webp");
  const [tier, setTier] = useState("VIP Model");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/ads");
      const data = await res.json();
      setProfiles(data);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu profili vitrinden tamamen silmek istediğine emin misin?")) return;
    try {
      await fetch("/api/admin/ads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      fetchProfiles();
    } catch (e) {
      alert("Silme başarısız!");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return alert("İsim ve görsel linki zorunludur!");
    
    try {
      await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: parseInt(age),
          phone: phone || "905520949245", // Fallback to site default
          image,
          tier,
          features: [tier]
        })
      });
      setName("");
      setPhone("");
      fetchProfiles();
    } catch (err) {
      alert("Ekleme başarısız!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-end border-b border-zinc-900 pb-4">
          <div>
            <Link href="/dorukcanay-hq" className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest mb-4 block">
              ← SİSTEME GERİ DÖN
            </Link>
            <h1 className="text-3xl lg:text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              VİTRİN <span className="text-purple-500">MANAGER</span>
            </h1>
            <div className="text-[10px] text-purple-500 uppercase tracking-[0.3em] font-mono mt-1">
              VIP Elite Profile Synchronization
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ADD NEW PROFILE FORM */}
          <div className="col-span-1">
             <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
               <h3 className="text-white text-lg font-black uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">
                 YENİ KIZ EKLE
               </h3>
               <form onSubmit={handleAdd} className="flex flex-col gap-4">
                 <div>
                   <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Profil İsmi</label>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Aylin" className="w-full bg-black border border-zinc-800 text-white p-3 focus:border-purple-500 outline-none" required />
                 </div>
                 <div>
                   <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Özel Telefon (Opsiyonel)</label>
                   <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Örn: 905551234567" className="w-full bg-black border border-zinc-800 text-white p-3 focus:border-purple-500 outline-none" />
                 </div>
                 <div>
                   <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Görsel URL</label>
                   <input type="text" value={image} onChange={e => setImage(e.target.value)} title="Görsel URL" placeholder="URL" className="w-full bg-black border border-zinc-800 text-white p-3 focus:border-purple-500 outline-none" required />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Yaş</label>
                      <input type="number" value={age} onChange={e => setAge(e.target.value)} title="Yaş" placeholder="Yaş" className="w-full bg-black border border-zinc-800 text-white p-3 focus:border-purple-500 outline-none" required />
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">Niş / Kategori</label>
                      <input type="text" value={tier} onChange={e => setTier(e.target.value)} title="Kategori" placeholder="Kategori" className="w-full bg-black border border-zinc-800 text-white p-3 focus:border-purple-500 outline-none" required />
                    </div>
                 </div>
                 <button type="submit" className="mt-4 bg-purple-900 hover:bg-purple-800 text-white font-black uppercase tracking-widest p-4 transition-colors">
                   SİSTEME ENJEKTE ET
                 </button>
               </form>
             </div>
          </div>

          {/* ACTIVE PROFILES LIST */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6">
               <h3 className="text-white text-lg font-black uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4 flex justify-between items-center">
                 <span>Aktif Vitrin Listesi</span>
                 <span className="text-xs bg-purple-900/30 text-purple-500 px-3 py-1 rounded-full">{profiles.length} Profil</span>
               </h3>
               
               {isLoading ? (
                 <div className="text-center text-zinc-500 py-10">Veriler Çekiliyor...</div>
               ) : (
                 <div className="flex flex-col gap-3">
                   {profiles.map((p, idx) => (
                     <div key={p.id} className="flex items-center gap-4 bg-black border border-zinc-800 p-3 hover:border-purple-500/50 transition-colors group">
                       <div className="w-12 h-12 bg-zinc-900 rounded overflow-hidden relative shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1">
                          <div className="text-white font-bold uppercase">{idx + 1}. {p.name} <span className="text-[10px] text-purple-500 ml-2">({p.tier})</span></div>
                          <div className="text-[10px] text-zinc-500 font-mono mt-1">TEL: +{p.phone}</div>
                       </div>
                       <div>
                         <button onClick={() => handleDelete(p.id)} className="bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors">
                           VİTRİNDEN SİL
                         </button>
                       </div>
                     </div>
                   ))}
                   {profiles.length === 0 && (
                     <div className="text-center text-zinc-500 py-10 italic">
                       Vitrin yönetim panelinde şu an hiç özel profil yok. Kalan boşluklar sistem havuzundan doldurulacaktır.
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
