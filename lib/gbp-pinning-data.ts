import { Metadata } from 'next';

/**
 * 🛰️ DRKCNAY ELITE - BRANCH AUTHORITY ENGINE
 * Creates high-trust landing pages for GBP verification acceleration.
 */

interface BranchData {
    slug: string;
    title: string;
    address: string;
    storeCode: string;
    description: string;
    category: string;
    coordinates: { lat: number, lng: number };
}

export const BRANCHES: BranchData[] = [
    {
        slug: "avcilar-vip-otopark",
        title: "Avcılar VIP Otopark Hizmetleri",
        address: "Cihangir, Şeftali Sokak No:38, 34310 Avcılar/İstanbul",
        storeCode: "00433316934278316355",
        description: "Avcılar bölgesinde 7/24 güvenli, elit araç park ve vale hizmetleri.",
        category: "Parking",
        coordinates: { lat: 40.9833123, lng: 28.7116103 }
    },
    {
        slug: "bagcilar-vip-cash-carry",
        title: "Bağcılar Vip Özerdoğan Cash & Carry",
        address: "Kirazlı, Mevlana Caddesi No:74 D:76, 34210 Bağcılar/İstanbul",
        storeCode: "13606951561664239671",
        description: "Bağcılar'ın en büyük toptan dağıtım ve cash & carry merkezi.",
        category: "Wholesale",
        coordinates: { lat: 41.0345123, lng: 28.8412103 }
    },
    {
        slug: "beyoglu-vip-otopark",
        title: "Asmalı Mescit VIP Otopark & Vale",
        address: "Asmalı Mescit, Asmalı Mescit Caddesi 47/9, 34430 Beyoğlu/İstanbul",
        storeCode: "07286630158774123919",
        description: "Beyoğlu'nun kalbinde profesyonel vale ve güvenli otopark çözümleri.",
        category: "Parking",
        coordinates: { lat: 41.0298123, lng: 28.9751103 }
    },
    {
        slug: "sisli-elite-concierge",
        title: "Şişli Elite Concierge & Danışmanlık",
        address: "Teşvikiye, Vali Konağı Cd. No:42 Kat: 3, 34365 Şişli/İstanbul",
        storeCode: "14355813303355406551",
        description: "Nişantaşı merkezli VIP lifestyle ve concierge danışmanlık hizmetleri.",
        category: "Concierge",
        coordinates: { lat: 41.0515123, lng: 28.9928103 }
    },
    {
        slug: "kadikoy-vip-tasarim",
        title: "Moda VIP Tasarım & Sanat Atölyesi",
        address: "Caferağa, Moda Cd. No:44, 34710 Kadıköy/İstanbul",
        storeCode: "PENDING_KADIKOY",
        description: "Moda'nın kalbinde kişiye özel lüks giyim tasarımları ve sanat danışmanlığı.",
        category: "Fashion Designer",
        coordinates: { lat: 40.985672, lng: 29.026411 }
    },
    {
        slug: "besiktas-etiler-concierge",
        title: "Etiler VIP Lifestyle & Concierge",
        address: "Etiler, Nispetiye Cd. No:62, 34337 Beşiktaş/İstanbul",
        storeCode: "PENDING_BESIKTAS",
        description: "Etiler bölgesinde prestijli lifestyle danışmanlığı ve VIP concierge hizmetleri.",
        category: "Concierge",
        coordinates: { lat: 41.0772, lng: 29.0328 }
    },
    {
        slug: "bakirkoy-luxury-styling",
        title: "Yeşilköy Luxury Styling & Moda",
        address: "Yeşilköy, İstasyon Cd. No:12, 34149 Bakırköy/İstanbul",
        storeCode: "PENDING_BAKIRKOY",
        description: "Yeşilköy sahil hattında lüks stil danışmanlığı ve moda tasarımı hizmetleri.",
        category: "Fashion Designer",
        coordinates: { lat: 40.9628, lng: 28.8256 }
    },
    {
        slug: "beylikduzu-skyport-vip",
        title: "Skyport Lüks Tasarım & Showroom",
        address: "Cumhuriyet Mah. Hürriyet Çıkmazı No:1, Skyport Plaza, 34520 Beylikdüzü/İstanbul",
        storeCode: "BEYLIKDUZU_SKYPORT_V4",
        description: "Beylikdüzü Skyport Plaza'da kişiye özel lüks giyim tasarımları ve özel koleksiyon sunumları.",
        category: "Lingerie Store",
        coordinates: { lat: 41.0072959, lng: 28.6639239 }
    }
];

export function generateBranchSchema(branch: BranchData) {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": branch.title,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": branch.address,
            "addressLocality": "İstanbul",
            "addressCountry": "TR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": branch.coordinates.lat,
            "longitude": branch.coordinates.lng
        },
        "url": `https://vipescorthizmeti.net/subeler/${branch.slug}`,
        "telephone": "+90212XXXXXXX",
        "identifier": branch.storeCode
    };
}
