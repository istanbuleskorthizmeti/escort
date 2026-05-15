import { DOMAIN_MATRIX, DomainConfig as MasterConfig } from '../../config/domains';

/**
 * 🔱 DRKCNAY HYDRA: MULTI-TENANT ENGINE (v2.0)
 * Resolves domain-specific identity, niche, and SEO metadata.
 * Uses config/domains.ts as the Source of Truth.
 */

export interface DomainConfig extends MasterConfig {
    niche: 'RUS' | 'ELITE' | 'VIP' | 'STUDENT' | 'MATURE';
    slogan: string;
    contactWhatsApp: string;
}

export function resolveDomainConfig(host: string): DomainConfig {
    const cleanHost = host.replace(/^www\./, '');
    const masterConfig = DOMAIN_MATRIX.find(d => cleanHost.includes(d.host)) || DOMAIN_MATRIX[0];

    // 🧬 DETERMINISTIC NICHE & SLOGAN LOGIC
    const niches: DomainConfig['niche'][] = ['RUS', 'ELITE', 'VIP', 'STUDENT', 'MATURE'];
    const hash = cleanHost.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const niche = masterConfig.role === 'CLOAKER' ? 'MATURE' : niches[hash % niches.length];

    const slogans = {
        'RUS': 'Gerçek Rus Escort Deneyimi ve %100 Vahşi Vitrin',
        'ELITE': 'İstanbul\'un En Seçkin Escort Rehberi - VIP Deneyim',
        'VIP': 'Lüks ve Gizlilik Odaklı VIP Escort Hizmeti',
        'STUDENT': 'Üniversiteli Elit Modeller ve Genç Escort Bayanlar',
        'MATURE': 'Olgun ve Tecrübeli Lady Escortlar ile Unutulmaz Anlar'
    };

    return {
        ...masterConfig,
        niche,
        slogan: slogans[niche],
        contactWhatsApp: '+905520949245',
        host: cleanHost
    };
}

/**
 * Deterministic Niche Picker (If domain not in matrix)
 */
export function getDeterministicNiche(host: string): DomainConfig['niche'] {
    const niches: DomainConfig['niche'][] = ['RUS', 'ELITE', 'VIP', 'STUDENT', 'MATURE'];
    const hash = host.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return niches[hash % niches.length];
}
