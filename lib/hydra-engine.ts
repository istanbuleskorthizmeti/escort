import { LOCAL_LANDMARKS } from './geo-data';

/**
 * 🐉 HYDRA: MASS CONQUER ENGINE v1.0
 * Otomatik ilçe fetih ve GBP onay altyapısı.
 */

interface HydraNode {
  district: string;
  safeName: string;
  category: string;
  addressVariation: string;
  isGenerated: boolean;
}

export const generateHydraNodes = (districts: string[]): HydraNode[] => {
  return districts.map(district => {
    const randomFloor = Math.floor(Math.random() * 5) + 1;
    const randomFlat = Math.floor(Math.random() * 15) + 1;
    
    return {
      district: district,
      safeName: `Dorukcan Ay - ${district.toUpperCase()} VIP Danışmanlık`,
      category: "Kişisel Asistan / Rehberlik",
      addressVariation: `No: 15, Kat: ${randomFloor}, Daire: ${randomFlat}`,
      isGenerated: true
    };
  });
};

export const HYDRA_NODES = generateHydraNodes([
  'besiktas', 'sisli', 'kadikoy', 'atasehir', 'bakirkoy', 
  'florya', 'sariyer', 'beylikduzu', 'esenyurt', 'basaksehir'
]);
