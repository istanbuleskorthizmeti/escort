
/**
 * DETERMINISTIC UTILITY ENGINE
 * Generates consistent trust signals for locations based on slug hashing.
 */

function cyrb128(str: string) {
  let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
}

export function generateLocationUtility(slug: string) {
  const seed = cyrb128(slug);
  
  const pharmacies = [
    "Derman Eczanesi", "Şifa Eczanesi", "Merkez Eczanesi", "Güneş Eczanesi", 
    "İlkyardım Eczanesi", "Can Eczanesi", "Huzur Eczanesi"
  ];
  
  const weather = ["Açık", "Parçalı Bulutlu", "Hafif Esintili"];
  const degrees = [18, 19, 20, 21, 22, 23, 24];

  return {
    pharmacy: pharmacies[seed % pharmacies.length],
    weather: weather[seed % weather.length],
    temp: degrees[seed % degrees.length],
    trustScore: 94 + (seed % 6), // 94-99 range
    activeUnits: 3 + (seed % 5), // 3-7 range
  };
}
