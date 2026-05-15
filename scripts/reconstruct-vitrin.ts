import fs from 'fs';
import path from 'path';

// This script reconstructs the vitrin-images.ts file based on the actual SEO-optimized images found on the server.
// It maps the available 'seo_' prefixed images to high-intent titles for maximum SEO impact.

const IMG_LIST = [
  "seo_0_pinterest_aesthetic_1.webp",
  "seo_100_photo_17_2026-05-04_17-54-52.webp",
  "seo_101_photo_17_2026-05-04_17-55-50.webp",
  "seo_102_photo_17_2026-05-04_17-56-58.webp",
  "seo_103_photo_18_2026-05-04_17-54-52.webp",
  "seo_104_photo_18_2026-05-04_17-55-50.webp",
  "seo_105_photo_18_2026-05-04_17-56-58.webp",
  "seo_106_photo_19_2026-05-04_17-54-52.webp",
  "seo_107_photo_19_2026-05-04_17-55-50.webp",
  "seo_108_photo_19_2026-05-04_17-56-58.webp",
  "seo_109_photo_1_2026-05-04_17-54-52.webp",
  "seo_10_vip-8.webp",
  "seo_110_photo_1_2026-05-04_17-55-50.webp",
  "seo_111_photo_1_2026-05-04_17-56-13.webp",
  "seo_112_photo_1_2026-05-04_17-56-57.webp",
  "seo_113_photo_1_2026-05-04_17-59-01.webp",
  "seo_114_photo_20_2026-05-04_17-54-52.webp",
  "seo_115_photo_20_2026-05-04_17-55-50.webp",
  "seo_116_photo_20_2026-05-04_17-56-58.webp",
  "seo_1_vip-1.webp",
  "seo_2_vip-16.webp",
  "seo_4_vip-2.webp",
  "seo_5_vip-22.webp",
  "seo_6_vip-24.webp",
  "seo_7_vip-2_gbp_vitrin_v2.webp",
  "seo_8_vip-3.webp",
  "seo_9_vip-4.webp"
];

const TITLES = [
  "ATEŞLİ RUS MODEL",
  "ÜNİVERSİTELİ ELİT",
  "SARIŞIN BOMBA",
  "OLGUN LADY VIP",
  "ESMER GÜZELLERİ",
  "UKRAYNALI MODEL",
  "KAPORASIZ GÜVENLİ",
  "ANAL FANTEZİ UZMANI",
  "SINIRSIZ HEYECAN",
  "MÜKEMMEL FİZİKLİ",
  "VIP VİTRİN SEÇKİSİ"
];

const output: any[] = [];

IMG_LIST.forEach((img, idx) => {
  output.push({
    title: TITLES[idx % TITLES.length] + " " + (idx + 1),
    src: `/_media/vitrin/${img}`
  });
});

console.log('export const vitrinImages = ' + JSON.stringify(output, null, 2) + ';');
