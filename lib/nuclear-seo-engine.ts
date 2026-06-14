import { Metadata } from 'next';
import { BRANCHES } from './gbp-pinning-data';

/**
 * 🛰️ DRKCNAY ELITE - NUCLEAR SEO CLOAKER
 * Bot detection, Aggressive Metadata, and Instant Redirects.
 */

const AGGRESSIVE_KEYWORDS = [
    "Escort", "Escort Hizmetleri", "Elite Hizmet", "Bayan", "VIP Escort", "Sınırsız", "Gizlilik", "Lüks", "Model"
];

export const ISTANBUL_DISTRICTS = [
    "Sefaköy"
];
// Beylikdüzü, Şişli, Kadıköy vb. onay aldıkça buraya eklenecek.

// Generates a massive semantic cloud for bots
export function generateAggressiveSemanticCloud() {
    return ISTANBUL_DISTRICTS.map(city => {
        return AGGRESSIVE_KEYWORDS.map(kw => `${city} ${kw}`).join(", ");
    }).join(", ");
}

export function generateNuclearMetadata(city: string): Metadata {
    const cloud = generateAggressiveSemanticCloud();
    return {
        title: `${city} VIP Escort Hizmetleri | %100 Gizlilik | DRKCNAY`,
        description: `${city} bölgesinde en elit, profesyonel ve gizlilik odaklı VIP escort hizmetleri sunumları. ${cloud}`,
        keywords: cloud,
        openGraph: {
            title: `${city} VIP Escort`,
            description: `${city} lüks escort sunumları ve profesyonel ajans hizmetleri.`,
            type: 'website',
        },
        alternates: {
            canonical: `https://dorukcanay.digital/s/${city.toLowerCase()}`,
        }
    };
}

export function generateAllDistrictsSchema() {
    return {
        "@context": "https://schema.org",
        "@graph": ISTANBUL_DISTRICTS.map(district => ({
            "@type": "LocalBusiness",
            "name": `${district} VIP Escort Hizmetleri`,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": district,
                "addressRegion": "İstanbul",
                "addressCountry": "TR"
            },
            "url": `https://dorukcanay.digital/s/${district.toLowerCase()}`,
            "telephone": "+12495448982",
            "email": "info@dorukcanay.digital",
            "priceRange": "$$$",
            "openingHours": "Mo-Su 00:00-24:00"
        }))
    };
}
