export interface VIPProfile {
  name: string;
  image: string;
  phone?: string; // Optional specific WhatsApp number for this profile
  niche?: string; // Optional specific niche (e.g. "Rus Model")
}

/**
 * 👑 DRKCNAY ELITE: MASTER VIP PROFILES
 * 
 * Bu listedeki profiller, sistemdeki tüm 56 domain'de (ve embed iframelerde)
 * her zaman EN ÜSTTE ve SABİT SIRADA çıkacaktır.
 * - Eğer 'phone' alanı boş bırakılırsa, global merkez numarasına yönlendirilir.
 * - Görseller '/assets/img/...' klasöründen seçilmelidir.
 */
export const MASTER_VIP_PROFILES: VIPProfile[] = [
  {
    name: "Aylin",
    image: "/assets/img/seo_0_pinterest_aesthetic_1.webp",
    phone: "905551234567", // Örnek: Sadece bu kıza özel numara
    niche: "Elit Rus Model"
  },
  {
    name: "Ceren",
    image: "/assets/img/seo_100_photo_17_2026-05-04_17-54-52.webp",
    niche: "Üniversiteli"
    // phone girilmediği için merkez numaraya düşer
  },
  {
    name: "Melis",
    image: "/assets/img/seo_10_vip-8.webp",
    niche: "Sarışın Bomba"
  },
  {
    name: "Buse",
    image: "/assets/img/seo_11_vitrin_v3_final_pilot.webp",
    niche: "VIP Model"
  },
  {
    name: "Ece",
    image: "/assets/img/seo_1_vip-1.webp",
    phone: "905559876543",
    niche: "Kaporasız"
  }
];
