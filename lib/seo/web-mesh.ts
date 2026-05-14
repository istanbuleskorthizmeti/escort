import { DOMAIN_MATRIX } from '../../config/domains';

/**
 * 🕸️ DRKCNAY WEB MESH
 * Uydular arasındaki "Komşu Semt" link hiyerarşisini belirler.
 */

const NEIGHBORHOOD_MAP: Record<string, string[]> = {
  "sefakoy": ["beylikduzu", "kucukcekmece", "esenyurt"],
  "beylikduzu": ["sefakoy", "esenyurt", "buyukcekmece"],
  "besiktas": ["sisli", "beyoglu", "sariyer"],
  "sisli": ["besiktas", "kagithane", "beyoglu"],
  "kadikoy": ["uskudar", "atasehir", "maltepe"],
  "esenyurt": ["beylikduzu", "avcilar", "basaksehir"]
};

export class WebMesh {
  
  static getNeighborLinks(currentDistrict: string) {
    const neighbors = NEIGHBORHOOD_MAP[currentDistrict.toLowerCase()] || [];
    const links: Array<{ host: string, name: string }> = [];

    neighbors.forEach(n => {
      const neighborDomain = DOMAIN_MATRIX.find(d => d.targetDistrict?.toLowerCase() === n && d.role === 'SATELLITE');
      if (neighborDomain) {
        links.push({
          host: neighborDomain.host,
          name: n.charAt(0).toUpperCase() + n.slice(1)
        });
      }
    });

    return links;
  }
}
