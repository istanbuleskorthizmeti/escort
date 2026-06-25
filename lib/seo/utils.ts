import { cities } from "../locations";

export function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/i̇/g, 'i');
}

export function resolveLocationContext(
  locParam: string | null,
  defaultCity: string,
  defaultDistrict: string
): {
  citySlug: string;
  districtSlug: string;
  neighborhoodSlug: string;
} {
  if (!locParam) {
    return {
      citySlug: defaultCity.toLowerCase(),
      districtSlug: defaultDistrict.toLowerCase(),
      neighborhoodSlug: ""
    };
  }

  const cleanLoc = locParam.toLowerCase().replace(/-escort$/i, '').replace(/-eskort$/i, '');

  // 1. Is cleanLoc a City?
  if (cities[cleanLoc]) {
    return {
      citySlug: cleanLoc,
      districtSlug: "",
      neighborhoodSlug: ""
    };
  }

  // 2. Is cleanLoc a District in any City?
  for (const [cSlug, cityObj] of Object.entries(cities)) {
    const dist = cityObj.districts.find(d => d.slug === cleanLoc);
    if (dist) {
      return {
        citySlug: cSlug,
        districtSlug: cleanLoc,
        neighborhoodSlug: ""
      };
    }
  }

  // 3. Is cleanLoc a Landmark in any City?
  for (const [cSlug, cityObj] of Object.entries(cities)) {
    const landmark = cityObj.landmarks?.find(l => l.slug === cleanLoc);
    if (landmark) {
      return {
        citySlug: cSlug,
        districtSlug: cleanLoc,
        neighborhoodSlug: ""
      };
    }
  }

  // 4. Is cleanLoc a Neighborhood in any District in any City?
  for (const [cSlug, cityObj] of Object.entries(cities)) {
    for (const distObj of cityObj.districts) {
      const neigh = distObj.neighborhoods.find(n => n.slug === cleanLoc);
      if (neigh) {
        return {
          citySlug: cSlug,
          districtSlug: distObj.slug,
          neighborhoodSlug: cleanLoc
        };
      }
    }
  }

  // 5. Check if it starts with a city prefix (like "tekirdag-cerkezkoy")
  const cityKeys = Object.keys(cities).sort((a, b) => b.length - a.length);
  for (const key of cityKeys) {
    if (cleanLoc.startsWith(`${key}-`)) {
      const rest = cleanLoc.substring(key.length + 1);
      return {
        citySlug: key,
        districtSlug: rest,
        neighborhoodSlug: ""
      };
    }
  }

  // Fallback: treat it as a district of the default city
  return {
    citySlug: defaultCity.toLowerCase(),
    districtSlug: cleanLoc,
    neighborhoodSlug: ""
  };
}
