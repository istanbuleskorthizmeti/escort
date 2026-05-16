
/**
 * 🧛‍♂️ HYDRA VITRIN BLACKLIST
 * Specific images that must NEVER be shown on any domain.
 */
export const VITRIN_BLACKLIST = [
    236, // User requested removal
    // Add other previously requested IDs here
];

export function isBlacklisted(id: number): boolean {
    return VITRIN_BLACKLIST.includes(id);
}

export function getSafeVipProfileIdx(id: number, fallbackOffset: number = 1): number {
    let currentId = id;
    let attempts = 0;
    while (isBlacklisted(currentId) && attempts < 50) {
        currentId = (currentId + fallbackOffset) % 310 + 1;
        attempts++;
    }
    return currentId;
}
