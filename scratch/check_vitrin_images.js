import { vitrinImages } from '../lib/vitrin-images';
console.log('Total images:', vitrinImages.length);
let ok = true;
vitrinImages.forEach((img, idx) => {
  if (!img.src) {
    console.error(`Index ${idx} is missing src:`, img);
    ok = false;
  }
});
if (ok) {
  console.log('All images have src!');
}
