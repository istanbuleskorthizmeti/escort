import { ISTANBUL_NEIGHBORS } from "./neighborhood-map";
import { normalizeTurkish } from "./utils";
import { cities } from "../locations";

/**
 * 🧛‍♂️ DRKCNAY HYDRA: SILO LINK WHEEL ENGINE (v2.0)
 * Generates dynamic contextually-linked neighborhood/district link widgets.
 * Propagates search engine PageRank cleanly to lower-tier routes across all 81 cities.
 */

interface LinkNode {
  name: string;
  url: string;
}

export class SeoLinker {
  /**
   * Generates structural contextual link block linking neighboring districts/neighborhoods.
   */
  public static generateNeighborhoodLinkWheel(
    citySlug: string,
    districtSlug: string,
    neighborhoodSlug?: string
  ): LinkNode[] {
    const cleanCity = citySlug.toLowerCase();
    const cleanDistrict = normalizeTurkish(districtSlug);
    const cleanNeigh = neighborhoodSlug ? normalizeTurkish(neighborhoodSlug) : "";

    const cityObj = cities[cleanCity];
    if (!cityObj) return [];

    const distObj = cityObj.districts.find(d => normalizeTurkish(d.slug) === cleanDistrict);
    if (!distObj) {
      // Fallback: If district not found, link the first few districts of the city
      return cityObj.districts.slice(0, 6).map(d => ({
        name: `${d.name.replace(/\s*(escort|eskort)\s*$/i, '')} Escort`,
        url: `/${cleanCity}/${d.slug}`
      }));
    }

    const distCleanName = distObj.name.replace(/\s*(escort|eskort)\s*$/i, '');
    const links: LinkNode[] = [];

    if (cleanNeigh) {
      // 1. Neighborhood Page Sibling & District Linking
      const siblingNeighs = distObj.neighborhoods.filter(n => normalizeTurkish(n.slug) !== cleanNeigh);
      for (const neigh of siblingNeighs.slice(0, 4)) {
        links.push({
          name: `${neigh.name} Escort`,
          url: `/${cleanCity}/${distObj.slug}/${neigh.slug}`
        });
      }

      // Link neighboring districts
      const neighbors = ISTANBUL_NEIGHBORS[cleanDistrict] || [];
      if (neighbors.length > 0) {
        for (const neighbor of neighbors.slice(0, 3)) {
          links.push({
            name: `${neighbor} Escort`,
            url: `/${cleanCity}/${normalizeTurkish(neighbor)}`
          });
        }
      } else {
        const siblingDistricts = cityObj.districts.filter(d => normalizeTurkish(d.slug) !== cleanDistrict);
        for (const dist of siblingDistricts.slice(0, 3)) {
          const cleanName = dist.name.replace(/\s*(escort|eskort)\s*$/i, '');
          links.push({
            name: `${cleanName} Escort`,
            url: `/${cleanCity}/${dist.slug}`
          });
        }
      }
    } else {
      // 2. District Page Neighborhoods & Sibling District Linking
      const neighborhoods = distObj.neighborhoods;
      for (const neigh of neighborhoods.slice(0, 4)) {
        links.push({
          name: `${distCleanName} ${neigh.name} Escort`,
          url: `/${cleanCity}/${distObj.slug}/${neigh.slug}`
        });
      }

      // Link neighboring or sibling districts
      const neighbors = ISTANBUL_NEIGHBORS[cleanDistrict] || [];
      if (neighbors.length > 0) {
        for (const neighbor of neighbors.slice(0, 4)) {
          links.push({
            name: `${neighbor} Escort`,
            url: `/${cleanCity}/${normalizeTurkish(neighbor)}`
          });
        }
      } else {
        const siblingDistricts = cityObj.districts.filter(d => normalizeTurkish(d.slug) !== cleanDistrict);
        for (const dist of siblingDistricts.slice(0, 4)) {
          const cleanName = dist.name.replace(/\s*(escort|eskort)\s*$/i, '');
          links.push({
            name: `${cleanName} Escort`,
            url: `/${cleanCity}/${dist.slug}`
          });
        }
      }
    }

    return links;
  }
}
