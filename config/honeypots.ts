/**
 * 🕸️ DRKCNAY HYDRA: HONEY-POT FLEET CONFIGURATION
 * 57 Domains Categorized by Psychological Trap Type.
 */

export type FleetType = 'PANIC' | 'HUNTER' | 'GREED' | 'DESPERATE' | 'GHOST' | 'SATELLITE';

export interface HoneyPotConfig {
    domain: string;
    fleet: FleetType;
    niche: string;
}

export const HONEYPOT_FLEET: HoneyPotConfig[] = [
    // 🛡️ 1. FİLO: "THE PANICS" (Korku, Aciliyet, Siber İstihbarat) -> Sert Yönlendirme
    { domain: 'plakasorgula.shop', fleet: 'PANIC', niche: 'edevlet' },
    { domain: 'santajci-tespit.site', fleet: 'PANIC', niche: 'siber' },
    { domain: 'casus-yazilim-sil.xyz', fleet: 'PANIC', niche: 'siber' },
    { domain: 'konumbulucu.xyz', fleet: 'PANIC', niche: 'siber' },

    // 🔞 2. FİLO: "THE HUNTERS" (İfşa, Sızıntı, Adult) -> En Yüksek VIP Dönüşüm
    { domain: 'exxvideos.shop', fleet: 'HUNTER', niche: 'adult' },
    { domain: 'sansursuzturkifsa.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'magazinifsa.site', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'sokhaberifsa.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'dilanpolatifsa.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'telegramifsaizle.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'turkifsalar.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'turkifsapremium.shop', fleet: 'HUNTER', niche: 'ifsa' },
    { domain: 'onlyfansizle.shop', fleet: 'HUNTER', niche: 'adult' },

    // 🎲 3. FİLO: "THE GREEDS" (Açgözlülük, Hile, Kaçak Yayın) -> Okyanus Trafik
    { domain: 'dizicehennemi.site', fleet: 'GREED', niche: 'dizi' },
    { domain: 'fragmanizle.shop', fleet: 'GREED', niche: 'dizi' },
    { domain: 'kesintisizizle.shop', fleet: 'GREED', niche: 'dizi' },
    { domain: 'canlimaclinki.shop', fleet: 'GREED', niche: 'mac' },
    { domain: 'fullapkoyun.shop', fleet: 'GREED', niche: 'apk' },
    { domain: 'instacoz.site', fleet: 'GREED', niche: 'smm' },
    { domain: 'tiktokhilesi.sbs', fleet: 'GREED', niche: 'smm' },
    { domain: 'bedavahesap.site', fleet: 'GREED', niche: 'premium' },
    { domain: 'kazandiranborsatuyolari.site', fleet: 'GREED', niche: 'kripto' },
    { domain: 'escortcoin.space', fleet: 'GREED', niche: 'kripto' },

    // 💸 4. FİLO: "THE DESPERATES" (Yardım, Çaresizlik, SMS) -> Görünmez Pop-Under (Saf Hit)
    { domain: 'yardimbasvurusu.online', fleet: 'DESPERATE', niche: 'edevlet' },
    { domain: 'sanalsms.site', fleet: 'DESPERATE', niche: 'sms' },

    // 🛰️ DRKCNAY SATELLITES (PBN Ana Uydular ve Kişisel Markalar) -> Doğrudan Index ve Link Gücü
    { domain: 'sariyerdrkcnay.shop', fleet: 'SATELLITE', niche: 'brand' },
    { domain: 'leventdrkcnay.shop', fleet: 'SATELLITE', niche: 'brand' },
    { domain: 'istanbuldrkcnay.shop', fleet: 'SATELLITE', niche: 'brand' },
    { domain: 'istanbulescortkaporasiz.shop', fleet: 'SATELLITE', niche: 'seo' },
    { domain: 'shopistanbulescortkaporasiz.site', fleet: 'SATELLITE', niche: 'seo' },
    { domain: 'dorukcanay.digital', fleet: 'SATELLITE', niche: 'brand' },

    // 🏥 5. FİLO: "THE HEALTHS" (E-Ticaret, Eczane, Performans) -> SMM & Cross-Sell
    { domain: 'eczane.vipescorthizmeti.com', fleet: 'GHOST', niche: 'health' },
    { domain: 'shop.vipescorthizmeti.com', fleet: 'GHOST', niche: 'health' },
    { domain: 'performans.vipescorthizmeti.com', fleet: 'GHOST', niche: 'health' },
];

export function getFleetConfig(host: string): HoneyPotConfig | undefined {
    return HONEYPOT_FLEET.find(d => host.includes(d.domain));
}
