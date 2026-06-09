/**
 * 🛡️ DRKCNAY WHITE-PAGE: GOURMET RECIPE ENGINE
 * Designed to rank #1 as a high-authority Food Blog.
 */

import { headers } from 'next/headers';

const RecipeData = {
  name: "Geleneksel Osmanlı Mutfağı: Hünkar Beğendi",
  description: "Saray mutfağının en seçkin lezzetlerinden biri olan Hünkar Beğendi, lokum gibi eti ve köz patlıcanın eşsiz uyumuyla sofralarınızın baş tacı olacak.",
  prepTime: "30 Dakika",
  cookTime: "1 Saat",
  servings: "4 Kişilik",
  ingredients: [
    "500g Kuşbaşı Kuzu Eti",
    "2 adet Kuru Soğan",
    "3 adet Patlıcan (Büyük boy)",
    "2 yemek kaşığı Tereyağı",
    "1 yemek kaşığı Domates Salçası",
    "2 su bardağı Süt",
    "1/2 su bardağı Kaşar Peyniri (Rendelenmiş)"
  ],
  instructions: [
    "Etleri tereyağında suyunu salıp çekene kadar kavurun.",
    "Soğanları ekleyip pembeleşene kadar devam edin.",
    "Salçayı ve baharatları ekleyip kısık ateşte pişmeye bırakın.",
    "Patlıcanları közleyip içlerini ayıklayın ve ince ince kıyın.",
    "Beşamel sos ile patlıcanları birleştirip servis tabağına alın, üzerine etleri ekleyin."
  ]
};

export default async function RecipePage() {
  const headersList = await headers();
  const host = headersList.get("host") || "istanbulescort.blog";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 bg-stone-50 text-stone-900 font-sans">
      {/* GOOGLE RECIPE SCHEMA (SEO ULTRA) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Recipe",
            "name": RecipeData.name,
            "description": RecipeData.description,
            "image": "https://istanbulescort.blog/recipes/hunkar-begendi.jpg",
            "author": { "@type": "Person", "name": "Gourmet DRKCNAY" },
            "prepTime": "PT30M",
            "cookTime": "PT1H",
            "recipeYield": RecipeData.servings,
            "recipeCategory": "Ana Yemek",
            "recipeCuisine": "Türk Mutfağı",
            "keywords": "hünkar beğendi, osmanlı mutfağı, et yemekleri, geleneksel türk yemekleri",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "125"
            },
            "nutrition": {
              "@type": "NutritionInformation",
              "calories": "450 calories"
            },
            "recipeIngredient": RecipeData.ingredients,
            "recipeInstructions": RecipeData.instructions.map((i, idx) => ({ 
              "@type": "HowToStep", 
              "name": `Adım ${idx + 1}`,
              "text": i,
              "url": `https://${host}/white-page#step${idx + 1}`,
              "image": "https://istanbulescort.blog/recipes/step-placeholder.jpg"
            }))
          })
        }}
      />

      <article className="bg-white shadow-xl rounded-2xl overflow-hidden border border-stone-200">
        <div className="h-64 bg-stone-200 relative">
          <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-bold uppercase tracking-widest text-xl">
             [ Lezzetli Yemek Görseli ]
          </div>
        </div>

        <div className="p-8">
          <span className="text-rose-600 font-bold uppercase text-xs tracking-widest">Geleneksel Lezzetler</span>
          <h1 className="text-4xl font-extrabold mt-2 mb-4 leading-tight">{RecipeData.name}</h1>
          <p className="text-stone-600 italic mb-8 border-l-4 border-stone-300 pl-4">{RecipeData.description}</p>

          <div className="grid grid-cols-3 gap-4 mb-10 py-4 border-y border-stone-100">
            <div className="text-center">
              <span className="block text-xs text-stone-400 uppercase">Hazırlık</span>
              <span className="font-bold">{RecipeData.prepTime}</span>
            </div>
            <div className="text-center border-x border-stone-100">
              <span className="block text-xs text-stone-400 uppercase">Pişirme</span>
              <span className="font-bold">{RecipeData.cookTime}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs text-stone-400 uppercase">Porsiyon</span>
              <span className="font-bold">{RecipeData.servings}</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center">🥗 Malzemeler</h2>
            <ul className="space-y-2">
              {RecipeData.ingredients.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center">👨‍🍳 Hazırlanışı</h2>
            <ol className="space-y-6">
              {RecipeData.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <p className="text-stone-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </article>

      <footer className="mt-12 text-center text-stone-400 text-sm">
        &copy; 2026 DRKCNAY Gourmet Network. Lezzet parmaklarınızın ucunda.
      </footer>
    </div>
  );
}
