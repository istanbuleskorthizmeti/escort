
/**
 * 🧛‍♂️ HYDRA VITRIN BLACKLIST
 * Specific images that must NEVER be shown on any domain.
 */
export const VITRIN_BLACKLIST = [
    236, // Removed per request
    79,  // Removed per request
    292, // Removed per request
    84,  // Removed per request
    139, // Removed per request
    130, // Removed per request
    184, // Removed per request
];

export function isBlacklisted(id: number): boolean {
    return VITRIN_BLACKLIST.includes(id);
}

export function getSafeVipProfileIdx(id: number, fallbackOffset: number = 1): number {
    let currentId = id;
    let attempts = 0;
    while (isBlacklisted(currentId) && attempts < 50) {
        currentId = (currentId + fallbackOffset) % 221 + 1;
        attempts++;
    }
    return currentId;
}
