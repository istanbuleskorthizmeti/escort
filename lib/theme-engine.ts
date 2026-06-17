/**
 * 🎨 DRKCNAY HYDRA: THEME ENGINE
 * Dynamically generates unique UI variables (colors, fonts, layouts)
 * based on the domain hash to prevent footprinting across the PBN.
 */

export interface ThemeConfig {


    primaryColor: string;
    secondaryColor: string;
    bgColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
    layoutType: 'grid' | 'carousel';
    borderStyle: string;
    glowEffect: string;
    brandName: string;
    slogan: string;
}

export class ThemeEngine {

    // Simple string hasher to get a consistent number for a domain
    private static hashDomain(domain: string): number {
        let hash = 0;
        for (let i = 0; i < domain.length; i++) {
            const char = domain.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Resolves a unique but consistent theme for a given domain
     */
    static getTheme(host: string): ThemeConfig {
        if (host.includes('dorukcanay.digital')) {
            return {
                primaryColor: '#d4af37', // Pure Flagship Gold
                secondaryColor: 'rgba(212,175,55,0.08)',
                bgColor: '#020202', // Pitch black
                textColor: '#f3f4f6',
                glowEffect: 'rgba(212,175,55,0.35)',
                headingFont: 'var(--font-playfair)',
                bodyFont: 'var(--font-inter)',
                layoutType: 'grid',
                borderStyle: 'rounded-[3rem]',
                brandName: 'DRKCNAY VIP ESCORT AJANSI',
                slogan: 'İstanbul VIP Escort & Lüks Eşlik Hizmetleri Portalı'
            };
        }

        const hash = this.hashDomain(host);

        // 🎨 [HYDRA-PALETTE] Nuclear HEX Palettes for direct injection (12+ Options for 56 Domains)
        const palettes = [
            { primary: '#e11d48', secondary: 'rgba(225,29,72,0.1)', bg: '#000000', text: '#d4d4d8', glow: 'rgba(225,29,72,0.3)' }, // Rose (Elite)
            { primary: '#f59e0b', secondary: 'rgba(245,158,11,0.1)', bg: '#09090b', text: '#d6d3d1', glow: 'rgba(245,158,11,0.3)' }, // Amber (Gold)
            { primary: '#a855f7', secondary: 'rgba(168,85,247,0.1)', bg: '#020617', text: '#cbd5e1', glow: 'rgba(168,85,247,0.3)' }, // Purple (Mystic)
            { primary: '#10b981', secondary: 'rgba(16,185,129,0.1)', bg: '#022c22', text: '#d1d5db', glow: 'rgba(16,185,129,0.3)' }, // Emerald (Safe)
            { primary: '#3b82f6', secondary: 'rgba(59,130,246,0.1)', bg: '#0a0a0a', text: '#94a3b8', glow: 'rgba(59,130,246,0.3)' }, // Blue (VIP)
            { primary: '#ff8600', secondary: 'rgba(255,134,0,0.1)', bg: '#000000', text: '#a1a1aa', glow: 'rgba(255,134,0,0.4)' }, // Orange (Fire)
            { primary: '#06b6d4', secondary: 'rgba(6,182,212,0.1)', bg: '#083344', text: '#cffafe', glow: 'rgba(6,182,212,0.4)' }, // Cyan (Cyber)
            { primary: '#ec4899', secondary: 'rgba(236,72,153,0.1)', bg: '#500724', text: '#fce7f3', glow: 'rgba(236,72,153,0.4)' }, // Pink (Candy)
            { primary: '#ef4444', secondary: 'rgba(239,68,68,0.1)', bg: '#450a0a', text: '#fee2e2', glow: 'rgba(239,68,68,0.4)' }, // Red (Danger/Aggressive)
            { primary: '#84cc16', secondary: 'rgba(132,204,22,0.1)', bg: '#1a2e05', text: '#ecfccb', glow: 'rgba(132,204,22,0.4)' }, // Lime (Neon Green)
            { primary: '#eab308', secondary: 'rgba(234,179,8,0.1)', bg: '#422006', text: '#fef08a', glow: 'rgba(234,179,8,0.4)' },  // Yellow (Sun/VIP)
            { primary: '#6366f1', secondary: 'rgba(99,102,241,0.1)', bg: '#1e1b4b', text: '#e0e7ff', glow: 'rgba(99,102,241,0.4)' }, // Indigo (Deep Royal)
            { primary: '#f43f5e', secondary: 'rgba(244,63,94,0.1)', bg: '#4c0519', text: '#ffe4e6', glow: 'rgba(244,63,94,0.4)' }  // Rose/Pink Hybrid (Sensual)
        ];

        // 🔡 [HYDRA-TYPO] Multi-font bridge to trick footprinting
        const headingFonts = ['var(--font-playfair)', 'var(--font-inter)', 'var(--font-outfit)'];
        
        const palette = palettes[hash % palettes.length];
        const layouts: Array<'grid' | 'carousel'> = ['grid', 'carousel'];
        const borders = ['rounded-none', 'rounded-xl', 'rounded-3xl', 'rounded-[3rem]'];

        const brandNames = [
            "DRKCNAY VIP ESCORT", "DRKCNAY VIP REHBERİ", "DRKCNAY ESCORT AJANSI",
            "DRKCNAY PRESTİJ ORTAĞI", "DRKCNAY SEÇKİN AJANS", "DRKCNAY GOLD REHBER",
            "DRKCNAY MODEL AJANSI", "DRKCNAY VIP PARTNER", "DRKCNAY LÜKS ESCORT",
            "DRKCNAY BİREYSEL PORTAL", "DRKCNAY GÜVENLİ AJANS", "DRKCNAY ESCORT NETWORK"
        ];
        
        const slogans = [
            "İstanbul'un En Prestijli ve Gizli Escort Rehberi", "Seçkin Beyefendilere Özel Kaporasız Escort Deneyimi",
            "Gerçek Görselli ve %100 Doğrulanmış VIP Escort İlanları", "Sadece Elit ve Profesyonel Escort Bayanlar",
            "7/24 Kesintisiz VIP Escort ve Gizlilik Standartları", "İstanbul'un En Güvenilir ve Seçkin Vitrini",
            "Otorite Puanı En Yüksek Elit Escort Platformu", "Kaporasız, Gizli ve Sınırsız VIP Deneyim"
        ];

        return {
            primaryColor: palette.primary,
            secondaryColor: palette.secondary,
            bgColor: palette.bg,
            textColor: palette.text,
            glowEffect: palette.glow,
            headingFont: headingFonts[hash % headingFonts.length],
            bodyFont: 'var(--font-inter)',
            layoutType: layouts[hash % layouts.length],
            borderStyle: borders[hash % borders.length],
            brandName: brandNames[hash % brandNames.length],
            slogan: slogans[hash % slogans.length]
        };
    }
}
