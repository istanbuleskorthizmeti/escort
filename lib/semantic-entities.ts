import { semanticRegistry } from "./semantic-registry";
import { istanbulData } from "./locations-registry/istanbul-data";

export const cityEntities = semanticRegistry;

export const genericEntities = {
  landmarks: ['Merkez Camii', 'Belediye Meydanı', 'Halk Pazarı', 'Hükümet Konağı', 'Şehir Stadı', 'Öğretmenevi'],
  vibe: 'huzurlu ve gelişmekte olan'
};

export function getCityVibe(citySlug: string, districtSlug?: string): string {
  if (citySlug === 'istanbul' && districtSlug && istanbulData[districtSlug]) {
    return istanbulData[districtSlug].vibe;
  }
  return cityEntities[citySlug]?.vibe || genericEntities.vibe;
}

export function getCityLandmarks(citySlug: string, districtSlug?: string): string[] {
  if (citySlug === 'istanbul' && districtSlug && istanbulData[districtSlug]) {
    return istanbulData[districtSlug].landmarks;
  }
  return cityEntities[citySlug]?.landmarks || genericEntities.landmarks;
}

export function getDistrictExtraData(citySlug: string, districtSlug: string) {
  if (citySlug === 'istanbul' && istanbulData[districtSlug]) {
    return istanbulData[districtSlug];
  }
  return null;
}
