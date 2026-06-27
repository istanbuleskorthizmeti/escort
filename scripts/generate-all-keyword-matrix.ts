import fs from 'fs';
import path from 'path';
import { cities } from '../lib/locations';

// 🧛‍♂️ DRKCNAY ELITE: TURKISH GEO-SEO MATRIX GENERATOR (v1.0)
// Permutates 81 cities, all districts, and neighborhoods with escort/eskort variations.

function normalizeTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/i̇/g, 'i'); // handles combined dot-i characters
}

function generateMatrix() {
  console.log("🚀 Permutating entire Turkish Geo-SEO matrix...");
  
  const keywordsSet = new Set<string>();
  const bases = ["escort", "eskort", "vip escort", "vip eskort", "escort bayan", "eskort bayan"];

  const addVariants = (prefix: string) => {
    const rawPrefix = prefix.toLowerCase().trim();
    const cleanPrefix = normalizeTurkish(rawPrefix);

    for (const base of bases) {
      keywordsSet.add(`${rawPrefix} ${base}`);
      keywordsSet.add(`${base} ${rawPrefix}`);
      
      // Also add normalized forms for maximum search suggest coverage
      if (rawPrefix !== cleanPrefix) {
        keywordsSet.add(`${cleanPrefix} ${base}`);
        keywordsSet.add(`${base} ${cleanPrefix}`);
      }
    }
  };

  const cityKeys = Object.keys(cities);
  console.log(`📍 Found ${cityKeys.length} provinces in registry.`);

  for (const cityKey of cityKeys) {
    const city = cities[cityKey];
    addVariants(city.name);

    if (city.districts) {
      for (const district of city.districts) {
        // Remove helper suffixes like " Escort" from district names if present
        const districtName = district.name.replace(/\s+escort/gi, '').replace(/\s+eskort/gi, '').trim();
        
        addVariants(districtName);
        addVariants(`${city.name} ${districtName}`);

        if (district.neighborhoods) {
          for (const neighborhood of district.neighborhoods) {
            const neighborhoodName = neighborhood.name.trim();
            
            addVariants(neighborhoodName);
            addVariants(`${districtName} ${neighborhoodName}`);
            addVariants(`${city.name} ${districtName} ${neighborhoodName}`);
          }
        }
      }
    }
  }

  const results = Array.from(keywordsSet);
  console.log(`🎯 Matrix generation complete! Total unique keywords: ${results.length}`);

  const outputDir = path.join(process.cwd(), 'scratch');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'all-keywords-matrix.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`💾 Saved to: ${outputPath}`);
}

generateMatrix();
